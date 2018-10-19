// services.tsx
/*
    This is the high level application controller
    It's main responsibility is to co-ordinate the store and the domain
    application -> datamodel + viewmodel -> domain (gateway) -> firebase

    datamodel and viewmodel are both bypassed
*/
/*
    TODO: OPTIMIZE!! Maintain cache items by some criterion such as usage or age
*/
import gateway from './gateway';
// ==============[ Internal ]===============
const documentcache = new Map();
const typecache = new Map();
// ===========[ Document Cache Management ]============
// document cache
const newDocumentCacheItem = () => {
    return {
        document: null,
        listeners: new Map(),
    };
};
const getDocumentCacheItem = (reference) => {
    let cacheitem;
    if (documentcache.has(reference)) {
        cacheitem = documentcache.get(reference);
    }
    else {
        cacheitem = newDocumentCacheItem();
        documentcache.set(reference, cacheitem);
        gateway.setDocumentListener(reference, processDocumentCallbacksFromGateway);
    }
    return cacheitem;
};
const processDocumentCallbacksFromGateway = (reference, document, change) => {
    let cacheitem = documentcache.get(reference);
    cacheitem.document = document;
    processDocumentCallbacks(reference, change);
    let typeref = document.identity.type;
    addTypeCacheListener(typeref, reference, processDocumentCallbacksFromType);
};
const processDocumentCallbacksFromType = (reference, change) => {
    processDocumentCallbacks(reference, change);
};
const processDocumentCallbacks = (reference, change) => {
    // console.log('processing document callbacks',reference)
    let documentcacheitem = documentcache.get(reference);
    let document = documentcacheitem.document;
    let typeref = document.identity.type;
    // console.log('typeref',typeref)
    if (typecache.has(typeref)) {
        // console.log('implementing document callbacks',reference)
        let type = typecache.get(typeref).document;
        let listeners = documentcacheitem.listeners;
        listeners.forEach((callback, key) => {
            callback(document, type, change);
        });
    }
};
const removeDocumentCacheItem = (reference) => {
    documentcache.delete(reference);
    // TODO: remove gateway listeners
};
// document listeners
const addDocumentCacheListener = (reference, instanceid, callback) => {
    let cacheitem = getDocumentCacheItem(reference);
    cacheitem.listeners.set(instanceid, callback);
};
const removeDocumentCacheListener = (reference, instanceid) => {
    if (!documentcache.has(reference))
        return;
    let cacheitem = documentcache.get(reference);
    cacheitem.listeners.delete(instanceid);
    if (cacheitem.listeners.size == 0) {
        removeDocumentCacheItem(reference); // filter by cache size?
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
    let cacheitem = typecache.get(reference);
    cacheitem.document = type;
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
    let cacheitem = typecache.get(documentreference);
    cacheitem.listeners.delete(documentreference);
    if (cacheitem.listeners.size == 0) {
        removeTypeCacheItem(typereference); // filter by cache size?
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
    // console.log('cachedata fetched, caches', reference, cachedata, documentcache, typecache)
    if (cachedata.document && cachedata.type) { // TODO: temp until type never missing
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