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
'use strict';
import domain from './domain';
import typefilter from './type.filter';
const documentCache = new class {
    constructor() {
        this.cache = new Map();
        this.addListener = (reference, instanceid, callback) => {
            let cacheitem = this.getItem(reference);
            cacheitem.listeners.set(instanceid, callback);
        };
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
                    reference, success: processDocumentCallbackFromGateway, failure: null
                };
                domain.setDocumentListener(parmblock);
            }
            return cacheitem;
        };
        this.newItem = () => {
            let cacheitem = {
                docpack: null,
                listeners: new Map(),
            };
            return cacheitem;
        };
        this.removeItem = (reference) => {
            // unhook from gateway
            domain.removeDocumentListener({ reference });
            // anticipate need for type cache listener...
            let documentcacheitem = this.cache.get(reference);
            this.cache.delete(reference);
            // console.log('documentcacheitem, reference', documentcacheitem, reference)
            // deal with type cache listener
            let document = documentcacheitem.document;
            if (document) {
                let typeref = document ? document.identity.type : null;
                if (typeref) {
                    _removeTypeCacheListener(typeref, reference);
                }
            }
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
// ==============[ Internal ]===============
/*
    Each document has an accompanying type. Types are shared, therefore far less numerous.
    The separation of the two allows for separate caching strategies.
*/
// const documentcache = new Map()
const typecache = new Map();
const sentinels = {};
/*
    callback from gateway. This sets or updates the document value, and calls
    callbacks registered for the document. Since every document requires a type,
    it also sets up a listener for the document type, such that update or setup of
    the type causes the document listeners to be udpated.

    if there is no type yet recorded, callbacks will not be processed.
*/
const processDocumentCallbackFromGateway = ({ docpack, reason }) => {
    // set or update document
    let cacheitem = documentCache.getItem(docpack.reference);
    if (!cacheitem)
        return; // async
    cacheitem.docpack = docpack;
    let typeref = docpack.document.identity.type; // all documents have a type
    // will only create if doesn't already exist
    _addTypeCacheListener(typeref, docpack.reference, _processDocumentCallbackFromType);
    // will not process without type
    _processDocumentCallbacks(docpack.reference, reason);
};
const _addTypeCacheListener = (typereference, documentreference, callback) => {
    let cacheitem = _getTypeCacheItem(typereference);
    if (!cacheitem.listeners.has(documentreference)) {
        cacheitem.listeners.set(documentreference, callback);
    }
};
const _getTypeCacheItem = (reference) => {
    let cacheitem;
    if (typecache.has(reference)) {
        cacheitem = typecache.get(reference);
    }
    else {
        cacheitem = _newTypeCacheItem();
        typecache.set(reference, cacheitem);
        let parmblock = {
            reference, success: processTypeCallbackFromGateway, failure: null
        };
        domain.setDocumentListener(parmblock);
    }
    return cacheitem;
};
const _newTypeCacheItem = () => {
    let cacheitem = {
        docpack: null,
        listeners: new Map(),
    };
    return cacheitem;
};
const processTypeCallbackFromGateway = ({ docpack, reason }) => {
    let typedoc = docpack || {};
    let cacheitem = typecache.get(typedoc.reference);
    let listeners = null;
    if (cacheitem) {
        cacheitem.docpack = typedoc;
        listeners = cacheitem.listeners;
    }
    if (listeners) {
        listeners.forEach((callback, key) => {
            callback(key, reason);
        });
    }
};
/*
    triggers document callbacks when the document's type is first set, or is updated.
*/
const _processDocumentCallbackFromType = (reference, reason) => {
    _processDocumentCallbacks(reference, reason);
};
/*
    processes a document's callbacks, whether called as the result of a
    document update from the gateway, or a document's type update from the gateway.
    listeners are not updated if there is not yet a type, or a type cache item
*/
const _processDocumentCallbacks = (reference, reason) => {
    let documentcacheitem = documentCache.getItem(reference);
    let { docpack, typepack } = _getDocumentPack(reference);
    if (typepack.document) {
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
const _removeTypeCacheItem = (reference) => {
    // unhook from domain
    domain.removeDocumentListener({ reference });
    typecache.delete(reference);
};
const _removeTypeCacheListener = (typereference, documentreference) => {
    if (!typecache.has(typereference))
        return;
    let cacheitem = typecache.get(typereference);
    if (cacheitem.listeners) {
        cacheitem.listeners.delete(documentreference);
        if (cacheitem.listeners.size == 0) {
            _removeTypeCacheItem(typereference); // filter by cache size?
        }
    }
};
// ===============[ General Utilities ]===============
const _getDocumentPack = reference => {
    let cacheitem = documentCache.getItem(reference);
    let docpack = cacheitem ? cacheitem.docpack : {};
    let typepack = null;
    let typeref = null;
    if (docpack.document) {
        typeref = docpack.document.identity.type;
        if (typecache.has(typeref)) {
            typepack = typecache.get(docpack.document.identity.type).docpack || {};
        }
    }
    let cachedata = {
        docpack,
        typepack,
    };
    return cachedata;
};
// =================[ API ]=======================
const properties = {
    ismobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
};
// called from component componentDidMount or componentWillUpdate
const setDocumentPairListener = ({ doctoken, instanceid, success, failure }) => {
    setTimeout(() => {
        let reference = doctoken.reference; // getTokenReference(doctoken)
        let sentinel = sentinels[instanceid]
            ? sentinels[instanceid][0]
            : undefined;
        if (sentinel === undefined) { // create listener
            sentinels[instanceid] = [false]; // allow continuation with set listener
        }
        else if (sentinel === true) { // stop was set; clear sentinal; abandon
            sentinels[instanceid].shift();
            if (sentinels[instanceid].length === 0) {
                delete sentinels[instanceid];
            }
            return;
        }
        else { // sentinel = false; continue with set listener
            sentinels[instanceid].push(false);
        }
        documentCache.addListener(reference, instanceid, success);
        let cachedata = _getDocumentPack(reference);
        if (cachedata.docpack && cachedata.typepack) { // defer if waiting for type
            let docpack = cachedata.docpack;
            let parmblock = {
                docpack,
                typepack: cachedata.typepack,
                reason: {
                    documents: {
                        reason: 'newcallback',
                        document: true,
                        type: true,
                    }
                }
            };
            success(parmblock);
        }
    });
};
// called from component componentWillUnmount
const removeDocumentPairListener = ({ doctoken, instanceid }) => {
    let reference = doctoken.reference;
    let sentinel = sentinels[instanceid]
        ? sentinels[instanceid][0]
        : undefined;
    if (sentinel === undefined) { // create sentinal; set before listener
        sentinels[instanceid] = [true];
        return;
    }
    else if (sentinel === false) { // clear sentinal; continue delete listener
        sentinels[instanceid].shift();
        if (sentinels[instanceid].length === 0) {
            delete sentinels[instanceid];
        }
    }
    else { // sentinal === true; was set for previous call; queue next
        sentinels[instanceid].push(true);
        return;
    }
    documentCache.removeListener(reference, instanceid);
};
const getDocument = (parmblock) => {
    domain.getDocument(parmblock);
};
const getNewDocument = (parmblock) => {
    domain.getNewDocument(parmblock);
};
const queryForDocument = (parmblock) => {
    domain.queryForDocument(parmblock);
};
const setDocument = (parmblock) => {
    domain.setDocument(parmblock);
};
const getCollection = (parmblock) => {
    domain.getCollection(parmblock);
};
let application = {
    properties,
    setDocumentPairListener,
    removeDocumentPairListener,
    getDocument,
    getNewDocument,
    queryForDocument,
    setDocument,
    getCollection,
};
export default application;
//# sourceMappingURL=application.jsx.map