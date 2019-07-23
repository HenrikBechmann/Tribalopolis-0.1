// docpackcache.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import domain from '../domain'
import typefilter from '../type.filter'
import { 
    SetGatewayListenerMessage,
    ReturnDocPackMessage,
    ReturnDocPairMessage,
    DocTokenStruc, 
    DocPackStruc,
    CacheItemStruc,
} from '../interfaces'

import typepackCache from './typepackcache'
import { sentinels } from '../application'
import { toast } from 'react-toastify'

// ==============================[ DOCUMENT CACHE ]===============================

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
        domain.removeDocumentListener(parmblock)

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

            // let typeref = (document && document.control.type)?document.control.type.reference:null

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

    private getItem = (reference, failure) => {

        let cacheitem

        if (this.cache.has(reference)) { // update if exists

            cacheitem = this.cache.get(reference)

        } else { // create if doesn't exist

            cacheitem = this.newItem()
            this.cache.set(reference,cacheitem)

            // connect to data source
            let parmblock:SetGatewayListenerMessage = {

                reference, success:this.successGetItem, failure:this.failureGetItem

            }
            
            domain.setDocumentListener(parmblock)

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
    private processListeners = (reference, reason) => {

        let documentcacheitem = this.getExistingItem(reference)

        if (!documentcacheitem) return

        let { docpack, listeners } = documentcacheitem

        listeners.forEach((callback,key) => {

            let slist = sentinels[key]

            if (slist && ((slist[slist.length - 1]) === false)) {

                let docpac:DocPackStruc = docpack

                let parmblock:ReturnDocPackMessage = {docpack:docpac, reason}
                callback( parmblock )

            }

        })

    }

    // TODO: allow for restart feature to accommodate change of
    // fetched document per document type change
    private processPairListeners = (reference, reason) => {

        let documentcacheitem = this.getExistingItem(reference)

        if (!documentcacheitem) return

        let {docpack,typepack}:{docpack:DocPackStruc,typepack:DocPackStruc} = this.getCacheDocpackPair(reference)

        if (typepack) {

            let result = typefilter.assertType(docpack.document,typepack.document)

            if (result && result.changed) { // '"result &&" added March 25, 2019 -- not required before that'

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

    //=====================[ API ]======================

    /*
        callback from gateway. This sets or updates the document value, and calls
        callbacks registered for the document. Since every document requires a type, 
        it also sets up a listener for the document type, such that update or setup of 
        the type causes the document listeners to be udpated.

        if there is no type yet recorded for paired items, callbacks will not be processed.
    */
    public successGetItem = ( {docpack, reason}:ReturnDocPackMessage ) => {

        // set or update document
        let cacheitem = this.getExistingItem(docpack.reference)

        if (!cacheitem) return // async

        let olddocpack = cacheitem.docpack

        cacheitem.docpack = docpack

        if (this.isPaired(docpack.document)) {

            // let oldtyperef = olddocpack? olddocpack.document.control.type:null

            let oldtyperef = olddocpack? olddocpack.document.control_type_reference:null

            // let typeref = docpack.document.control.type?docpack.document.control.type.reference:null; // all documents have a type

            let typeref = docpack.document.control_type_reference?docpack.document.control_type_reference:null; // all documents have a type

            (oldtyperef && (oldtyperef !== typeref)) && typepackCache.removeListener(oldtyperef,docpack.reference)

            // will only create if doesn't already exist
            // processPairListeners invoked first time
            typeref && typepackCache.addListener(typeref, docpack.reference, this.processPairListeners, null) 

            // will not process without type (including first time)
            this.processPairListeners(docpack.reference,reason) 

        } else {

            this.processListeners(docpack.reference,reason)

        }

    }

    public failureGetItem = (error, reason) => {

        console.log('docpackCache error', error, reason)

    }

    public addListener = (reference, instanceid, callback, failure) => {

        let cacheitem = this.getItem(reference, this.failureAddListener)

        cacheitem.listeners.set(instanceid,callback)

    }

    private failureAddListener = (error, reason) => {
        console.log('docpackCache failureAddListener error, reason', error, reason)
    }

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
        let docpack:DocPackStruc = cacheitem?cacheitem.docpack:{}
        return docpack
    }

    public getCacheDocpackPair = reference => {

        let cacheitem = this.getExistingItem(reference)
        let docpack:DocPackStruc = (cacheitem && cacheitem.docpack)?cacheitem.docpack:{}
        let typepack:DocPackStruc = null
        let typeref = null

        if (docpack.document) {

            // TODO this next two lines should become errors if no typeref or type found
            // typeref = docpack.document.control.type?docpack.document.control.type.reference:null

            typeref = docpack.document.control_type_reference?docpack.document.control_type_reference:null

            typepack = typeref?typepackCache.getCacheDocpack(typeref):{} as DocPackStruc

        }

        let cachedata = {
            docpack,
            typepack,
        }

        return cachedata

    }

}

export default docpackCache

