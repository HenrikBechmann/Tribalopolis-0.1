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

// ==============[ Internal ]===============

/*
    Each document has an accompanying type. Types are shared, therefore far less numerous.
    The separation of the two allows for separate caching strategies.
*/

const sentinels = {}

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

        // console.log('docpack, cacheitem in UPDATEITEM',docpack, cacheitem)

        let oldtyperef = cacheitem.docpack? cacheitem.docpack.document.identity.type:null

        cacheitem.docpack = docpack

        let typeref = docpack.document.identity.type; // all documents have a type

        (oldtyperef && (oldtyperef != typeref)) && typeCache.removeListener(oldtyperef,docpack.reference)

        // will only create if doesn't already exist
        typeref && typeCache.addListener(typeref, docpack.reference, typeCache.processDocumentPairListeners) 

        // will not process without type
        this.processPairListeners(docpack.reference,reason) 

    }

    /*
        processes a document's callbacks, whether called as the result of a 
        document update from the gateway, or a document's type update from the gateway.
        listeners are not updated if there is not yet a type, or a type cache item
    */
    processPairListeners = (reference, reason) => {

        let documentcacheitem = documentCache.getItem(reference)

        let {docpack,typepack} = appManager.getDocumentPair(reference)

        if (typepack) {

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

// ==============================[ TYPE CACHE ]===============================

const typeCache = new class {
    private cache = new Map()

    // same
    newItem = () => {

        let cacheitem:CacheItemStruc = {
            docpack:null,
            listeners:new Map(),
        }

        return cacheitem

    }

    // different
    removeItem = (reference) => {

        // unhook from domain
        let parmblock:DocTokenStruc = {reference}
        domain.removeDocumentListener(parmblock)

        this.cache.delete(reference)

    }

    // same
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

    // different
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

    // different
    processDocumentPairListeners = ( reference, reason ) => { // document reference

        documentCache.processPairListeners(reference,reason)

    }

    // different
    addListener = (typereference, documentreference, callback) => {

        let cacheitem = this.getItem(typereference)

        if (!cacheitem.listeners.has(documentreference)) {

            cacheitem.listeners.set(documentreference,callback)

        }
    }

    // different
    removeListener = (typereference, documentreference) => {

        if (!this.cache.has(typereference)) return

        let cacheitem = this.cache.get(typereference)

        if (cacheitem.listeners) {

            cacheitem.listeners.delete(documentreference)

            if (cacheitem.listeners.size == 0) {

                this.removeItem(typereference) // TODO: filter by cache size?

            }

        }

    }


}

// =================[ API ]=======================

const appManager = new class {

    properties = {

        ismobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

    }

    // =================[ INTERNAL TO MODULE ]=======================
    getDocumentPair = reference => {

        let cacheitem = documentCache.getItem(reference)
        let docpack:DocPackStruc = cacheitem?cacheitem.docpack:{}
        let typepack:DocPackStruc = null
        let typeref = null

        if (docpack.document) {

            typeref = docpack.document.identity.type

            let cacheItem = typeCache.getItem(typeref)

            typepack = cacheItem.docpack
            
        }

        let cachedata = {
            docpack,
            typepack,
        }

        return cachedata

    }

    // =================[ API ]=======================
    // called from component componentDidMount or componentWillUpdate
    setDocumentPairListener = ({doctoken,instanceid,success, failure}:SetPairListenerMessage) => {

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

            let cachedata = appManager.getDocumentPair(reference)

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
    removeDocumentPairListener = ({doctoken, instanceid}:RemovePairListenerMessage) => {

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

    getDocument = (parmblock:GetDocumentMessage) => {

        domain.getDocument(parmblock)

    }

    getNewDocument = (parmblock:GetDocumentMessage) => {

        domain.getNewDocument(parmblock)

    }

    queryForDocument = (parmblock:GetDocumentMessage) => {

        domain.queryForDocument(parmblock)
        
    }

    setDocument = (parmblock:SetDocumentMessage) => {

        domain.setDocument(parmblock)

    }

    getCollection = (parmblock:GetCollectionMessage) => {

        domain.getCollection(parmblock)
        
    }

}

let application = {

    properties:appManager.properties,
    setDocumentPairListener:appManager.setDocumentPairListener,
    removeDocumentPairListener:appManager.removeDocumentPairListener,
    getDocument:appManager.getDocument,
    getNewDocument:appManager.getNewDocument,
    queryForDocument:appManager.queryForDocument,
    setDocument:appManager.setDocument,
    getCollection:appManager.getCollection,

}

export default application