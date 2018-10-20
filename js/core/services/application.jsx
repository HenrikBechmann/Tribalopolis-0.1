// services.tsx
/*
    This is the high level application controller
    It's main responsibility is to co-ordinate the store and the domain
    application -> datamodel + viewmodel -> domain (gateway) -> firebase

    datamodel and viewmodel are both bypassed
*/
/*
    TODO:
        - OPTIMIZE!! Maintain cache items by some criterion such as usage or age
        - rationalize "change" object
        - enhance to handle types as documents (when edited or created)
        - add CREATED, UPDATED, LASTUSED, and USAGECOUNT stamps to cache items
        - implement state item garbage collection (no listeners)
        - implement general max for cache (1000?) with trigger to reduce to 900 or so
*/
import gateway from './gateway';
// ==============[ Internal ]===============
/*
    Each document has an accompanying type. Types are shared, therefore far less numerous.
    The separation of the two allows for separate caching strategies.
*/
const documentcache = new Map();
const typecache = new Map();
// ===========[ Document Cache Management ]============
/*
    There is a separate set of methods for each of the document and type caches.
*/
// -----------[ document cache ]-----------
/*
    Returns a initialized document cache item
*/
const newDocumentCacheItem = () => {
    return {
        document: null,
        listeners: new Map(),
    };
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
        gateway.setDocumentListener(reference, processDocumentCallbacksFromGateway);
    }
    return cacheitem;
};
/*
    callback from gateway. This sets or updates the document value, and calls
    callbacks registered for the document. Since every document requires a type,
    it also sets up a listener for the document type, such that update or setup of
    the type causes the document listeners to be udpated.

    if there is no type yet recorded, callbacks will not be processed.
*/
const processDocumentCallbacksFromGateway = (reference, document, change) => {
    // set or update document
    let cacheitem = documentcache.get(reference);
    cacheitem.document = document;
    // will not process without type
    processDocumentCallbacks(reference, change);
    let typeref = document.identity.type; // all documents have a type
    // will only create if doesn't already exist
    addTypeCacheListener(typeref, reference, processDocumentCallbacksFromType);
};
/*
    This triggers document callbacks when the document's type is first set, or is updated.
*/
const processDocumentCallbacksFromType = (reference, change) => {
    processDocumentCallbacks(reference, change);
};
/*
    Thsi processes a document's callbacks, whether called as the result of a
    document update from the gateway, or a document's type update from the gateway.
    listeners are not updated if there is not yet a type, or a type cache item
*/
const processDocumentCallbacks = (reference, change) => {
    // console.log('processing document callbacks',reference)
    let documentcacheitem = documentcache.get(reference);
    let document = documentcacheitem.document;
    let typeref = document.identity.type;
    // console.log('typeref',typeref)
    if (typecache.has(typeref)) {
        // console.log('implementing document callbacks',reference)
        let type = typecache.get(typeref).document;
        if (type) {
            let listeners = documentcacheitem.listeners;
            listeners.forEach((callback, key) => {
                callback(document, type, change);
            });
        }
    }
};
/*
    removes a document item from the document cache
    also removes the listeners from the gateway and the related type
*/
const removeDocumentCacheItem = (reference) => {
    // unhook from gateway
    gateway.removeDocumentListener(reference);
    // anticipate need for type cache listener...
    let documentcacheitem = documentcache.get(reference);
    documentcache.delete(reference);
    // deal with type cache listener
    let document = documentcacheitem.document;
    if (document) {
        let typeref = document ? document.identity.type : null;
        if (typeref) {
            removeTypeCacheListener(typeref, reference);
        }
    }
};
// ------------[ document listeners ]---------------
const addDocumentCacheListener = (reference, instanceid, callback) => {
    let cacheitem = getDocumentCacheItem(reference);
    cacheitem.listeners.set(instanceid, callback);
};
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
// ===========[ Type Cache Management ]============
// type cache
const newTypeCacheItem = () => {
    return {
        document: null,
        listeners: new Map(),
    };
};
const getTypeCacheItem = (reference) => {
    let cacheitem;
    if (typecache.has(reference)) {
        cacheitem = typecache.get(reference);
    }
    else {
        // console.log('creating type cache',reference)
        cacheitem = newTypeCacheItem();
        typecache.set(reference, cacheitem);
        gateway.setDocumentListener(reference, processTypeCallbacksFromGateway);
    }
    return cacheitem;
};
const processTypeCallbacksFromGateway = (reference, type, change) => {
    // console.log('processing type callback from gateway',reference)
    let typedoc = type || {};
    let cacheitem = typecache.get(reference);
    cacheitem.document = typedoc;
    let listeners = cacheitem.listeners;
    listeners.forEach((callback, key) => {
        // console.log('implementing callback from type for ',key)
        callback(key, change);
    });
};
const removeTypeCacheItem = (reference) => {
    typecache.delete(reference);
    // TODO: remove gateway listeners
};
// type listeners
const addTypeCacheListener = (typereference, documentreference, callback) => {
    let cacheitem = getTypeCacheItem(typereference);
    if (!cacheitem.listeners.has(documentreference)) {
        cacheitem.listeners.set(documentreference, callback);
    }
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
const getTokenReference = token => {
    return `/${token.collection}/${token.id}`;
};
const getDocumentPack = reference => {
    let document = documentcache.get(reference).document;
    let type = null;
    let typeref = null;
    if (document) {
        typeref = document.identity.type;
        if (typecache.has(typeref)) {
            type = typecache.get(document.identity.type).document || {};
        }
    }
    let cachedata = {
        document,
        type,
    };
    return cachedata;
};
// =================[ API ]=======================
const properties = {
    ismobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
};
const setDocumentListener = (token, instanceid, callback) => {
    let reference = getTokenReference(token);
    addDocumentCacheListener(reference, instanceid, callback);
    let cachedata = getDocumentPack(reference);
    if (cachedata.document && cachedata.type) { // defer if waiting for type
        // console.log('IMMEDIATE callback',reference)
        callback(cachedata.document, cachedata.type, {
            documents: {
                reason: 'newcallback',
                document: true,
                type: true,
            }
        });
    }
};
const removeDocumentListener = (token, instanceid) => {
    let reference = getTokenReference(token);
    removeDocumentCacheListener(reference, instanceid);
};
let application = {
    properties,
    setDocumentListener,
    removeDocumentListener,
};
export default application;
//# sourceMappingURL=application.jsx.map