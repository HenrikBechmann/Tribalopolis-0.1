// docpackcache.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import gateway from '../gateway'
import typefilter from '../type.filter'
import { 
    SetGatewayListenerMessage,

    DocpackPayloadMessage,
    DocpackPairPayloadMessage,
    
    DocTokenStruc, 
    DocPackStruc,

    CacheItemStruc,
} from '../interfaces'

import typepackCache from './typepackcache'
import { callbacksentinels } from '../application'
import { toast } from 'react-toastify'

// ==============================[ DOCUMENT CACHE ]===============================

const PAIRED_LISTENER = true, NOT_PAIRED_LISTENER = false

const docpackCache = new class {

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
        gateway.removeDocumentListener(parmblock)

        // anticipate need for type cache listener...
        let documentcacheitem = this.cache.get(reference)

        if (!documentcacheitem) return

        this.cache.delete(reference)

        let document = null
        // deal with type cache listener
        if (documentcacheitem && documentcacheitem.docpack && documentcacheitem.docpack.document) {
            document = documentcacheitem.docpack.document
         } else {
             document = null
             return
         }

        if (this.isPaired(document)) {

            let typeref = (document && document.control_type_reference)

            if (typeref) {

                typepackCache.removeListener(typeref,reference)

            }

        }

    }

    private isPaired = document => {
        try {

            return !!document.control_type_reference

        } catch(e) {

            return false

        }
    }

    private getItem = (reference, failure, paired, newdocument = null) => {

        let cacheitem

        if (this.cache.has(reference)) { // update if exists

            cacheitem = this.cache.get(reference)

        } else { // create if doesn't exist

            cacheitem = this.newItem()
            this.cache.set(reference,cacheitem)

            // connect to data source
            let parmblock:SetGatewayListenerMessage = {

                reference, 
                success:this.successGetItem, 
                failure:this.failureGetItemFunc(failure), 
                paired,
                newdocument,

            }
            // console.log('docpackcache calling gateway.setDocumentListener',parmblock)
            gateway.setDocumentListener(parmblock)

        }

        return cacheitem
    }

    private getExistingItem = (reference) => {

        let cacheitem = null

        if (this.cache.has(reference)) { // update if exists

            cacheitem = this.cache.get(reference)

        }

        return cacheitem
     }
    /*
        processes a document's callbacks, whether called as the result of a 
        document update from the gateway, or a document's type update from the gateway.
        listeners are not updated if there is not yet a type, or a type cache item
    */
    // the most recent sentinel must be available and ready to process (== false)
    private processListeners = (reference, reason) => {

        let documentcacheitem = this.getExistingItem(reference)

        if (!documentcacheitem) return

        let { docpack, listeners } = documentcacheitem

        listeners.forEach((callback,key) => {

            let slist = callbacksentinels[key]

            if (slist && ((slist[slist.length - 1]) === false)) {

                let docpac:DocPackStruc = docpack

                let parmblock:DocpackPayloadMessage = {docpack:docpac, reason}
                callback( parmblock )

            }

        })

    }

    // TODO: allow for restart feature to accommodate change of
    // fetched document per document type change
    private processPairListeners = (reference, reason) => {

        let documentcacheitem = this.getExistingItem(reference)

        // console.log('ENTER docpackcache processPairListeners: reference, reason, documentcacheitem',reference, reason, documentcacheitem)
        if (!documentcacheitem) return

        let {docpack,typepack}:{docpack:DocPackStruc,typepack:DocPackStruc} = this.getCacheDocpackPair(reference, reason.sourceparms.newdocument)

        // console.log('docpackcache processPairListeners: docpack, typepack',
            // reference, reason, documentcacheitem, docpack, typepack)

        if (typepack) {

            let result = typefilter.assertType(docpack.document,typepack.document)

            if (result && result.changed) { // '"result &&" added March 25, 2019 -- not required before that'

                docpack.document = result.document
                // update source; wait for response

            }

            let { listeners } = documentcacheitem

            listeners.forEach((callback,key) => {

                let slist = callbacksentinels[key]

                if (slist && ((slist[slist.length - 1]) === false)) {

                    let docpac:DocPackStruc = docpack

                    let parmblock:DocpackPairPayloadMessage = {docpack:docpac, typepack, reason}
                    callback( parmblock )

                }

            })
        }
    }

    //=====================[ API ]======================

    /*
        callback from gateway. This sets or updates the document value, and calls
        callbacks registered for the document. Since every document requires a type, 
        it also sets up a listener for the document type, such that update or setup of 
        the type causes the document listeners to be udpated.

        if there is no type yet recorded for paired items, callbacks will not be processed.
    */
    public successGetItem = ( parmblock:DocpackPayloadMessage ) => {

        let {docpack, reason} = parmblock
        // set or update document
        let cacheitem = this.getExistingItem(docpack.reference)

        // console.log('docpackcache successGetItem: parmblock, cacheitem',parmblock, cacheitem)

        if (!cacheitem) return // async

        let olddocpack = cacheitem.docpack

        cacheitem.docpack = docpack

        let { paired, newdocument } = reason.sourceparms

        if ( paired && (newdocument || this.isPaired(docpack.document))) {

            let oldtyperef = (olddocpack && olddocpack.document)? olddocpack.document.control_type_reference:null

            let typereference = (newdocument?newdocument.typereference:null)

            let typeref = (typereference || (docpack.document.control_type_reference?docpack.document.control_type_reference:null)); // all documents have a type

            (oldtyperef && (oldtyperef !== typeref)) && typepackCache.removeListener(oldtyperef,docpack.reference)

            // console.log('docpackcache successGetItem calling typepackCache.addListener: typeref, reference',typeref, docpack.reference)

            // will only create if doesn't already exist
            // processPairListeners invoked first time
            // typeref && // must exist!
            typepackCache.addListener(typeref, docpack.reference, this.typepackCacheSuccessFunc(docpack.reference, reason), reason.sourceparms.failure) 

            // will not process without type (including first time)
            this.processPairListeners(docpack.reference,reason) 

        } else {

            this.processListeners(docpack.reference,reason)

        }

    }

    private typepackCacheSuccessFunc = (localreference, localreason) => {
        return (reference, reason) => {
            this.processPairListeners(localreference,localreason)
        }
    }

    private failureGetItemFunc = (failure) => {
         return (error, reason) => {

            console.log('docpackCache error', error, reason)
            this.removeItem(reason.reference)
            failure && failure(error,reason)

        }
    }

    public addPairedListener = (reference, instanceid, callback, failure, newdocument) => {

        // console.log('addPairedListener in docpackcache',reference,instanceid,callback,failure )

        let cacheitem = this.getItem(reference, failure, PAIRED_LISTENER, newdocument)

        cacheitem.listeners.set(instanceid,callback)

    }

    public addListener = (reference, instanceid, callback, failure) => {

        let cacheitem = this.getItem(reference, failure, NOT_PAIRED_LISTENER)

        cacheitem.listeners.set(instanceid,callback)

    }

    // private failureAddListener = (error, reason) => {
    //     console.log('docpackCache failureAddListener error, reason', error, reason)
    //     this.cache.delete(reason.reference)
    //     reason && reason.sourceparms && reason.sourcparms.failure && reason.sourceparms.failure(error,reason)
    // }

    public removeListener = (reference, instanceid) => {

        if (!this.cache.has(reference)) {
            // console.log('warning: reference not found in docpackcache removeListener',reference)
            return
        }

        let cacheitem = this.cache.get(reference)

        if (cacheitem.listeners) {

            cacheitem.listeners.delete(instanceid)

            if (cacheitem.listeners.size == 0) {

                this.removeItem(reference) // filter by cache size?

            }

        } else {
            console.log('cacheitem.listeners not found in docpackcache removeListener', reference)
        }

    }

    public isListener = (reference,instanceid) => {

        if (!this.cache.has(reference)) {
            return false
        }

        let cacheitem = this.cache.get(reference)

        if (cacheitem.listeners) {

            return cacheitem.listeners.has(instanceid)

        } else {
            return false
        }   
    }

    public getCacheDocpack = reference => {

        let cacheitem = this.getExistingItem(reference)
        let docpack:DocPackStruc = cacheitem?cacheitem.docpack:null
        return docpack
    }

    public getCacheDocpackPair = (reference, newdocument = null) => {

        let cacheitem = this.getExistingItem(reference)
        let docpack:DocPackStruc = (cacheitem && cacheitem.docpack)?cacheitem.docpack:null
        let typepack:DocPackStruc = null
        let typeref = null

        // let typereference = (newdocument && newdocument.typereference) || null

        if (newdocument) {

            typeref = (newdocument && newdocument.typereference) || null

        } else {

            if (docpack && docpack.document) {

                // TODO this next two lines should become errors if no typeref or type found
                // typeref = docpack.document.control.type?docpack.document.control.type.reference:null

                typeref = docpack.document.control_type_reference?docpack.document.control_type_reference:null

            }

        }

        typepack = typeref?typepackCache.getCacheDocpack(typeref):{} as DocPackStruc // TODO: {} required for local prototype data

        // console.log('docpackcache getCacheDocpackPair: reference, typeref, newdocument, docpack, typepack',reference, typeref, newdocument, docpack, typepack)

        let cachedata = {
            docpack,
            typepack,
        }

        return cachedata

    }

}

export default docpackCache

