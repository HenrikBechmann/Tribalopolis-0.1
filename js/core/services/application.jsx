// services.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
/*
    This is the high level application controller
    It's main responsibility is to co-ordinate the store and the domain
    application -> datamodel + viewmodel -> domain -> gateway -> firebase

    datamodel and viewmodel are both bypassed
*/
/*
    TODO:

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
// ==============[ Internal ]===============
/*
    Each document has an accompanying type. Types are shared, therefore far less numerous.
    The separation of the two allows for separate caching strategies.
*/
const documentcache = new Map();
const typecache = new Map();
const sentinels = {};
// ===========[ Document Cache Management ]============
/*
    There is a separate set of methods for each of the document and type caches.
*/
// adds a document listener to be updated when a document changes or is set
const addDocumentCacheListener = (reference, instanceid, callback) => {
    let cacheitem = getDocumentCacheItem(reference);
    cacheitem.listeners.set(instanceid, callback);
};
/*
    Retrieves an existing cache item, or creates and retrieves a new one.
    For a new cache item, sets up a document listener with the gateway, for document
    data updates, and the first version of the document. So when the cache item
    is first created, it has no document data, just a place for it.
*/
const getDocumentCacheItem = (reference) => {
    let cacheitem;
    if (documentcache.has(reference)) { // update if exists
        cacheitem = documentcache.get(reference);
    }
    else { // create if doesn't exist
        cacheitem = newDocumentCacheItem();
        documentcache.set(reference, cacheitem);
        // connect to data source
        domain.setDocumentPairListener({ reference, success: processDocumentCallbackFromGateway, failure: null });
    }
    return cacheitem;
};
// -----------[ document and type cache flow ]-----------
/*
    Returns a initialized document cache item
*/
const newDocumentCacheItem = () => {
    let cacheitem = {
        docpack: null,
        listeners: new Map(),
    };
    return cacheitem;
};
/*
    callback from gateway. This sets or updates the document value, and calls
    callbacks registered for the document. Since every document requires a type,
    it also sets up a listener for the document type, such that update or setup of
    the type causes the document listeners to be udpated.

    if there is no type yet recorded, callbacks will not be processed.
*/
const processDocumentCallbackFromGateway = ({ docpack, reason }) => {
    // set or update document
    let cacheitem = documentcache.get(docpack.reference);
    if (!cacheitem)
        return; // async
    cacheitem.docpack = docpack;
    let typeref = docpack.document.identity.type; // all documents have a type
    // will only create if doesn't already exist
    addTypeCacheListener(typeref, docpack.reference, processDocumentCallbacksFromType);
    // will not process without type
    processDocumentCallbacks(docpack.reference, reason);
};
const addTypeCacheListener = (typereference, documentreference, callback) => {
    let cacheitem = getTypeCacheItem(typereference);
    if (!cacheitem.listeners.has(documentreference)) {
        cacheitem.listeners.set(documentreference, callback);
    }
};
const getTypeCacheItem = (reference) => {
    let cacheitem;
    if (typecache.has(reference)) {
        cacheitem = typecache.get(reference);
    }
    else {
        cacheitem = newTypeCacheItem();
        typecache.set(reference, cacheitem);
        domain.setDocumentPairListener({ reference, success: processTypeCallbacksFromGateway, failure: null });
    }
    return cacheitem;
};
const newTypeCacheItem = () => {
    let cacheitem = {
        docpack: null,
        listeners: new Map(),
    };
    return cacheitem;
};
const processTypeCallbacksFromGateway = (reference, type, reason) => {
    let typedoc = type || {};
    let cacheitem = typecache.get(reference);
    let listeners = null;
    if (cacheitem) {
        cacheitem.docpack.document = typedoc;
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
const processDocumentCallbacksFromType = (reference, reason) => {
    processDocumentCallbacks(reference, reason);
};
/*
    processes a document's callbacks, whether called as the result of a
    document update from the gateway, or a document's type update from the gateway.
    listeners are not updated if there is not yet a type, or a type cache item
*/
const processDocumentCallbacks = (reference, reason) => {
    let documentcacheitem = documentcache.get(reference);
    let { docpack, typepack } = getDocumentPack(reference);
    // console.log('processDocumentCallbacks document,type',document,type)
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
                let retval = { docpack: docpac, typepack, reason };
                callback(retval);
            }
        });
    }
};
/*
    removes a document item from the document cache
    also removes the listeners from the gateway and the related type
*/
const removeDocumentCacheItem = (reference) => {
    // unhook from gateway
    domain.removeDocumentPairListener({ reference });
    // anticipate need for type cache listener...
    let documentcacheitem = documentcache.get(reference);
    documentcache.delete(reference);
    // console.log('documentcacheitem, reference', documentcacheitem, reference)
    // deal with type cache listener
    let document = documentcacheitem.document;
    if (document) {
        let typeref = document ? document.identity.type : null;
        if (typeref) {
            removeTypeCacheListener(typeref, reference);
        }
    }
};
// ------------[ remove listeners and cache items ]---------------
// removes a document listener when the observer is dismounted
const removeDocumentCacheListener = (reference, instanceid) => {
    if (!documentcache.has(reference))
        return;
    let cacheitem = documentcache.get(reference);
    if (cacheitem.listeners) {
        cacheitem.listeners.delete(instanceid);
        if (cacheitem.listeners.size == 0) {
            removeDocumentCacheItem(reference); // filter by cache size?
        }
    }
};
const removeTypeCacheItem = (reference) => {
    // unhook from domain
    domain.removeDocumentPairListener(reference);
    typecache.delete(reference);
};
const removeTypeCacheListener = (typereference, documentreference) => {
    if (!typecache.has(typereference))
        return;
    let cacheitem = typecache.get(typereference);
    if (cacheitem.listeners) {
        cacheitem.listeners.delete(documentreference);
        if (cacheitem.listeners.size == 0) {
            removeTypeCacheItem(typereference); // filter by cache size?
        }
    }
};
// ===============[ General Utilities ]===============
const getDocumentPack = reference => {
    let cacheitem = documentcache.get(reference);
    let docpack = cacheitem ? cacheitem.docpack : {};
    let typepack = null;
    let typeref = null;
    if (docpack.document) {
        typeref = docpack.document['identity'].type;
        if (typecache.has(typeref)) {
            typepack = typecache.get(docpack.document['identity'].type).docpack || {};
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
        addDocumentCacheListener(reference, instanceid, success);
        let cachedata = getDocumentPack(reference);
        if (cachedata.docpack && cachedata.typepack) { // defer if waiting for type
            let docpack = cachedata.docpack;
            let retval = {
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
            success(retval);
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
    removeDocumentCacheListener(reference, instanceid);
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