// services.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
/*
    This is the high level application controller
    It's main responsibility is to co-ordinate the store and the domain
    application -> datamodel + viewmodel -> domain -> gateway -> firebase

    source code style:
    local functions are prefixed with underscrore (_)
    parameters between modules are parmblocks
*/

/*
    TODO: 

        - create appManager class for general utilities
        - create document and type cache objects to assemble data and related methods
        - add documentSubscribe for single documents (without type) for things like /system/parameters
        - process document changed by type in processDocumentCallbacks
        consider creating a sentinel when callbacks are de-registered to avoid race
        condition of calling setState after component is unmounted
        NOTE: sentinels, commented out, not working Oct 27, 2018

        - OPTIMIZE!! Maintain cache items by some criterion such as usage or age
        - rationalize "change" object
        - enhance to handle types as documents (when edited or created)
        - add CREATED, UPDATED, LASTUSED, and USAGECOUNT stamps to cache items
        - implement state item garbage collection (no listeners)
        - implement general max for cache (1000?) with trigger to reduce to 900 or so
*/

'use strict'

import domain from './domain'
import merge from 'deepmerge'
import typefilter from './type.filter'
import { 
    GetDocumentMessage, 
    SetDocumentMessage, 
    GetCollectionMessage,
    DocTokenStruc, 
    SetPairListenerMessage,
    RemovePairListenerMessage,
    SetGatewayListenerMessage,
    DocPackStruc,
    CacheItemStruc,
    ReturnDocPackMessage,
    ReturnDocPairMessage,
} from './interfaces'

// ==============================[ DOCUMENT CACHE ]===============================

const documentCache = new class {

    //=====================[ PRIVATE ]======================
    
    private cache = new Map()

    private newItem = () => {

        let cacheitem:CacheItemStruc = {
            docpack:null,
            listeners: new Map(),
        }

        return cacheitem

    }

    private removeItem = (reference) => {

        // unhook from gateway
        let parmblock:DocTokenStruc = {reference}
        domain.removeDocumentListener(parmblock)

        // anticipate need for type cache listener...
        let documentcacheitem = this.cache.get(reference)
        this.cache.delete(reference)

        // console.log('documentcacheitem, reference', documentcacheitem, reference)
        // deal with type cache listener
        let document = documentcacheitem.document
        if (document) {

            let typeref = document?document.identity.type:null
            if (typeref) {

                typeCache.removeListener(typeref,reference)

            }

        }

    }

    //=====================[ API ]======================

    getItem = (reference) => {

        let cacheitem

        if (this.cache.has(reference)) { // update if exists

            cacheitem = this.cache.get(reference)

        } else { // create if doesn't exist

            cacheitem = this.newItem()
            this.cache.set(reference,cacheitem)

            // connect to data source
            let parmblock:SetGatewayListenerMessage = {
                reference, success:this.updateItem, failure:null
            }
            domain.setDocumentListener(parmblock)

        }

        return cacheitem
    }

    /*
        callback from gateway. This sets or updates the document value, and calls
        callbacks registered for the document. Since every document requires a type, 
        it also sets up a listener for the document type, such that update or setup of 
        the type causes the document listeners to be udpated.

        if there is no type yet recorded, callbacks will not be processed.
    */
    updateItem = ( {docpack, reason}:ReturnDocPackMessage ) => {

        // set or update document
        let cacheitem = this.getItem(docpack.reference)

        if (!cacheitem) return // async

        cacheitem.docpack = docpack

        let typeref = docpack.document.identity.type // all documents have a type

        // will only create if doesn't already exist
        typeCache.addListener(typeref, docpack.reference, typeCache.processListeners) 

        // will not process without type
        this.processListeners(docpack.reference,reason) 

    }

    /*
        processes a document's callbacks, whether called as the result of a 
        document update from the gateway, or a document's type update from the gateway.
        listeners are not updated if there is not yet a type, or a type cache item
    */
    processListeners = (reference, reason) => {

        let documentcacheitem = documentCache.getItem(reference)

        let {docpack,typepack} = _getDocumentPair(reference)

        if (typepack.document) {

            let result = typefilter.assertType(docpack.document,typepack.document)
            if (result.changed) {

                docpack.document = result.document
                // update source; wait for response

            }

            let { listeners } = documentcacheitem

            listeners.forEach((callback,key) => {

                let slist = sentinels[key]

                if (slist && ((slist[slist.length - 1]) === false)) {

                    let docpac:DocPackStruc = docpack

                    let parmblock:ReturnDocPairMessage = {docpack:docpac, typepack, reason}
                    callback( parmblock )

                }

            })
        }
    }

    addListener = (reference,instanceid,callback) => {

        let cacheitem = this.getItem(reference)

        cacheitem.listeners.set(instanceid,callback)

    }

    removeListener = (reference, instanceid) => {

        if (!this.cache.has(reference)) return

        let cacheitem = this.cache.get(reference)

        if (cacheitem.listeners) {

            cacheitem.listeners.delete(instanceid)

            if (cacheitem.listeners.size == 0) {

                this.removeItem(reference) // filter by cache size?

            }

        }

    }
}

// ==============[ Internal ]===============

/*
    Each document has an accompanying type. Types are shared, therefore far less numerous.
    The separation of the two allows for separate caching strategies.
*/

// const documentcache = new Map()
// const typecache = new Map()

const sentinels = {}

const typeCache = new class {
    private cache = new Map()

    addListener = (typereference, documentreference, callback) => {

        let cacheitem = this.getItem(typereference)

        if (!cacheitem.listeners.has(documentreference)) {

            cacheitem.listeners.set(documentreference,callback)

        }
    }

    getItem = (reference) => { // type reference
        let cacheitem

        if (this.cache.has(reference)) {

            cacheitem = this.cache.get(reference)

        } else {

            cacheitem = this.newItem()
            this.cache.set(reference,cacheitem)

            let parmblock: SetGatewayListenerMessage = {
                reference, success:this.updateItem,failure:null
            }
            domain.setDocumentListener(parmblock)

        }

        return cacheitem
        
    }

    newItem = () => {

        let cacheitem:CacheItemStruc = {
            docpack:null,
            listeners:new Map(),
        }

        return cacheitem

    }

    updateItem = ( {docpack, reason}:ReturnDocPackMessage ) => {

        let typedoc = docpack || ({} as DocPackStruc)
        let cacheitem = this.cache.get(typedoc.reference)
        let listeners = null

        if (cacheitem) {

            cacheitem.docpack = typedoc
            listeners = cacheitem.listeners

        }

        if (listeners) {

            listeners.forEach((callback,key) => {

                callback(key,reason)

            })
        }

    }

    processListeners = ( reference, reason ) => { // document reference

        documentCache.processListeners(reference,reason)

    }

    removeItem = (reference) => {

        // unhook from domain
        domain.removeDocumentListener({reference})

        this.cache.delete(reference)

    }

    removeListener = (typereference, documentreference) => {

        if (!this.cache.has(typereference)) return

        let cacheitem = this.cache.get(typereference)

        if (cacheitem.listeners) {

            cacheitem.listeners.delete(documentreference)

            if (cacheitem.listeners.size == 0) {

                this.removeItem(typereference) // filter by cache size?

            }

        }

    }


}
// const _addTypeCacheListener = (typereference, documentreference, callback) => {

//     let cacheitem = _getTypeCacheItem(typereference)

//     if (!cacheitem.listeners.has(documentreference)) {

//         cacheitem.listeners.set(documentreference,callback)

//     }
// }

// const _getTypeCacheItem = (reference) => { // type reference
//     let cacheitem

//     if (typecache.has(reference)) {

//         cacheitem = typecache.get(reference)

//     } else {

//         cacheitem = _newTypeCacheItem()
//         typecache.set(reference,cacheitem)

//         let parmblock: SetGatewayListenerMessage = {
//             reference, success:processTypeCallbackFromGateway,failure:null
//         }
//         domain.setDocumentListener(parmblock)

//     }

//     return cacheitem
    
// }

// const _newTypeCacheItem = () => {

//     let cacheitem:CacheItemStruc = {
//         docpack:null,
//         listeners:new Map(),
//     }

//     return cacheitem

// }

// const processTypeCallbackFromGateway = ( {docpack, reason}:ReturnDocPackMessage ) => {

//     let typedoc = docpack || ({} as DocPackStruc)
//     let cacheitem = typecache.get(typedoc.reference)
//     let listeners = null

//     if (cacheitem) {

//         cacheitem.docpack = typedoc
//         listeners = cacheitem.listeners

//     }

//     if (listeners) {

//         listeners.forEach((callback,key) => {

//             callback(key,reason)

//         })
//     }

// }

/*
    triggers document callbacks when the document's type is first set, or is updated.
*/
// const _processDocumentCallbackFromType = ( reference, reason ) => { // document reference

//     documentCache.processListeners(reference,reason)

// }

// const _removeTypeCacheItem = (reference) => {

//     // unhook from domain
//     domain.removeDocumentListener({reference})

//     typecache.delete(reference)

// }

// const _removeTypeCacheListener = (typereference, documentreference) => {

//     if (!typecache.has(typereference)) return

//     let cacheitem = typecache.get(typereference)

//     if (cacheitem.listeners) {

//         cacheitem.listeners.delete(documentreference)

//         if (cacheitem.listeners.size == 0) {

//             _removeTypeCacheItem(typereference) // filter by cache size?

//         }

//     }

// }

// ===============[ General Utilities ]===============

const _getDocumentPair = reference => {

    let cacheitem = documentCache.getItem(reference)
    let docpack:DocPackStruc = cacheitem?cacheitem.docpack:{}
    let typepack:DocPackStruc = null
    let typeref = null

    if (docpack.document) {

        typeref = docpack.document.identity.type

        let cacheItem = typeCache.getItem(typeref)

        typepack = cacheItem.docpack || {}
        
    }

    let cachedata = {
        docpack,
        typepack,
    }

    return cachedata

}

// =================[ API ]=======================

const properties = {

    ismobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

}

// called from component componentDidMount or componentWillUpdate
const setDocumentPairListener = ({doctoken,instanceid,success, failure}:SetPairListenerMessage) => {

    setTimeout(()=>{ // give animations a chance to run

        let reference = doctoken.reference // getTokenReference(doctoken)

        let sentinel = 
            sentinels[instanceid]
            ?sentinels[instanceid][0]
            :undefined

        if (sentinel === undefined) { // create listener

            sentinels[instanceid]=[false] // allow continuation with set listener

        } else if (sentinel === true) { // stop was set; clear sentinal; abandon

            sentinels[instanceid].shift()

            if (sentinels[instanceid].length === 0) {

                delete sentinels[instanceid]

            }

            return

        } else { // sentinel = false; continue with set listener

            sentinels[instanceid].push(false)   

        }

        documentCache.addListener(reference,instanceid,success)

        let cachedata = _getDocumentPair(reference)

        if (cachedata.docpack && cachedata.typepack) { // defer if waiting for type
            let docpack:DocPackStruc = cachedata.docpack

            let parmblock:ReturnDocPairMessage = {
                docpack, 
                typepack:cachedata.typepack, 
                reason:{
                    documents:{
                        reason:'newcallback',
                        document:true, 
                        type:true,
                    }
                }
            }

            success(parmblock)

        }

    })

}

// called from component componentWillUnmount
const removeDocumentPairListener = ({doctoken, instanceid}:RemovePairListenerMessage) => {

    let reference = doctoken.reference

    let sentinel = 
        sentinels[instanceid]
        ?sentinels[instanceid][0]
        :undefined

    if (sentinel === undefined) { // create sentinal; set before listener

        sentinels[instanceid]=[true]

        return

    } else if (sentinel === false) { // clear sentinal; continue delete listener

        sentinels[instanceid].shift()

        if (sentinels[instanceid].length === 0) {

            delete sentinels[instanceid]
        }

    } else { // sentinal === true; was set for previous call; queue next

        sentinels[instanceid].push(true)

        return
    }

    documentCache.removeListener(reference,instanceid)

}

const getDocument = (parmblock:GetDocumentMessage) => {

    domain.getDocument(parmblock)

}

const getNewDocument = (parmblock:GetDocumentMessage) => {

    domain.getNewDocument(parmblock)

}

const queryForDocument = (parmblock:GetDocumentMessage) => {

    domain.queryForDocument(parmblock)
    
}

const setDocument = (parmblock:SetDocumentMessage) => {

    domain.setDocument(parmblock)

}

const getCollection = (parmblock:GetCollectionMessage) => {

    domain.getCollection(parmblock)
    
}

let application = {
    properties,
    setDocumentPairListener,
    removeDocumentPairListener,
    getDocument,
    getNewDocument,
    queryForDocument,
    setDocument,
    getCollection,
}

export default application