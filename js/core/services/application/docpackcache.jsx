// docpackcache.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import domain from '../domain';
import typefilter from '../type.filter';
import typepackCache from './typepackcache';
import { sentinels } from '../application';
// ==============================[ DOCUMENT CACHE ]===============================
const docpackCache = new class {
    constructor() {
        //=====================[ PRIVATE ]======================
        this.cache = new Map();
        this.newItem = () => {
            let cacheitem = {
                docpack: null,
                listeners: new Map(),
            };
            return cacheitem;
        };
        this.removeItem = (reference) => {
            // unhook from gateway
            let parmblock = { reference };
            domain.removeDocumentListener(parmblock);
            // anticipate need for type cache listener...
            let documentcacheitem = this.cache.get(reference);
            this.cache.delete(reference);
            // deal with type cache listener
            let document = documentcacheitem.document;
            if (this.isPaired(document)) {
                let typeref = document ? document.identity.type : null;
                if (typeref) {
                    typepackCache.removeListener(typeref, reference);
                }
            }
        };
        this.isPaired = document => {
            try {
                let identity = document.identity;
                return ('type' in identity);
            }
            catch (e) {
                return false;
            }
        };
        //=====================[ API ]======================
        this.getItem = (reference) => {
            let cacheitem;
            if (this.cache.has(reference)) { // update if exists
                cacheitem = this.cache.get(reference);
            }
            else { // create if doesn't exist
                cacheitem = this.newItem();
                this.cache.set(reference, cacheitem);
                // connect to data source
                let parmblock = {
                    reference, success: this.updateItem, failure: null
                };
                domain.setDocumentListener(parmblock);
            }
            return cacheitem;
        };
        this.getCacheDocpack = reference => {
            let cacheitem = docpackCache.getItem(reference);
            let docpack = cacheitem ? cacheitem.docpack : {};
            return docpack;
        };
        this.getCacheDocpackPair = reference => {
            let cacheitem = docpackCache.getItem(reference);
            let docpack = cacheitem ? cacheitem.docpack : {};
            let typepack = null;
            let typeref = null;
            if (docpack.document) {
                typeref = docpack.document.identity.type;
                let cacheItem = typepackCache.getItem(typeref);
                typepack = cacheItem.docpack;
            }
            let cachedata = {
                docpack,
                typepack,
            };
            return cachedata;
        };
        /*
            callback from gateway. This sets or updates the document value, and calls
            callbacks registered for the document. Since every document requires a type,
            it also sets up a listener for the document type, such that update or setup of
            the type causes the document listeners to be udpated.
    
            if there is no type yet recorded, callbacks will not be processed.
        */
        this.updateItem = ({ docpack, reason }) => {
            // set or update document
            let cacheitem = this.getItem(docpack.reference);
            if (!cacheitem)
                return; // async
            let olddocpack = cacheitem.docpack;
            // console.log('docpack, cacheitem in UPDATEITEM',docpack, cacheitem)
            cacheitem.docpack = docpack;
            if (this.isPaired(docpack.document)) {
                let oldtyperef = olddocpack ? olddocpack.document.identity.type : null;
                let typeref = docpack.document.identity.type; // all documents have a type
                (oldtyperef && (oldtyperef != typeref)) && typepackCache.removeListener(oldtyperef, docpack.reference);
                // will only create if doesn't already exist
                typeref && typepackCache.addListener(typeref, docpack.reference, typepackCache.processDocumentPairListeners);
                // will not process without type
                this.processPairListeners(docpack.reference, reason);
            }
            else {
                this.processListeners(docpack.reference, reason);
            }
        };
        /*
            processes a document's callbacks, whether called as the result of a
            document update from the gateway, or a document's type update from the gateway.
            listeners are not updated if there is not yet a type, or a type cache item
        */
        this.processListeners = (reference, reason) => {
            let documentcacheitem = docpackCache.getItem(reference);
            let { docpack, listeners } = documentcacheitem;
            listeners.forEach((callback, key) => {
                let slist = sentinels[key];
                if (slist && ((slist[slist.length - 1]) === false)) {
                    let docpac = docpack;
                    let parmblock = { docpack: docpac, reason };
                    callback(parmblock);
                }
            });
        };
        this.processPairListeners = (reference, reason) => {
            let documentcacheitem = docpackCache.getItem(reference);
            let { docpack, typepack } = this.getCacheDocpackPair(reference);
            if (typepack) {
                let result = typefilter.assertType(docpack.document, typepack.document);
                if (result.changed) {
                    docpack.document = result.document;
                    // update source; wait for response
                }
                let { listeners } = documentcacheitem;
                listeners.forEach((callback, key) => {
                    let slist = sentinels[key];
                    if (slist && ((slist[slist.length - 1]) === false)) {
                        let docpac = docpack;
                        let parmblock = { docpack: docpac, typepack, reason };
                        callback(parmblock);
                    }
                });
            }
        };
        this.addListener = (reference, instanceid, callback) => {
            let cacheitem = this.getItem(reference);
            cacheitem.listeners.set(instanceid, callback);
        };
        this.removeListener = (reference, instanceid) => {
            if (!this.cache.has(reference))
                return;
            let cacheitem = this.cache.get(reference);
            if (cacheitem.listeners) {
                cacheitem.listeners.delete(instanceid);
                if (cacheitem.listeners.size == 0) {
                    this.removeItem(reference); // filter by cache size?
                }
            }
        };
    }
};
export default docpackCache;
//# sourceMappingURL=docpackcache.jsx.map