// services.tsx
/*
    This is the high level application controller
    It's main responsibility is to co-ordinate the store and the domain
    application -> datamodel + viewmodel -> domain (gateway) -> firebase

    datamodel and viewmodel are both bypassed
*/
/*
    TODO:
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
        let document = gateway.setDocumentListener(reference);
        updateDocumentCacheData(reference, document);
        // trigger matching type
        let typeref = document.identity.type;
        let type = getTypeCacheItem(typeref);
        addTypeCacheListener(typeref, reference, processDocumentCallbacksFromType);
    }
    return cacheitem;
};
const processDocumentCallbacksFromType = (reference, change) => {
    processDocumentCallbacks(reference, change);
};
const processDocumentCallbacksFromGateway = (reference, document, change) => {
    let cacheitem = documentcache.get(reference);
    cacheitem.document = document;
    processDocumentCallbacks(reference, change);
};
const processDocumentCallbacks = (reference, change) => {
    let documentcacheitem = documentcache.get(reference);
    let document = documentcacheitem.document;
    let type = typecache.get(document.identity.type).document;
    let listeners = documentcacheitem.listeners;
    listeners.forEach((callback, key) => {
        callback(document, type, change);
    });
};
const removeDocumentCacheItem = (reference) => {
    documentcache.delete(reference);
    // TODO: remove gateway listeners
};
// document data
const updateDocumentCacheData = (reference, document) => {
    let documentcacheitem = getDocumentCacheItem(reference);
    documentcacheitem.document = document;
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
        cacheitem = newTypeCacheItem();
        typecache.set(reference, cacheitem);
        let type = gateway.setDocumentListener(reference);
        updateTypeCacheData(reference, type);
    }
    return cacheitem;
};
const processTypeCallbacksFromGateway = (reference, type, change) => {
    let cacheitem = typecache.get(reference);
    cacheitem.document = type;
    let listeners = cacheitem.listeners;
    listeners.forEach((callback, key) => {
        callback(document, type, change);
    });
};
const removeTypeCacheItem = (reference) => {
    typecache.delete(reference);
    // TODO: remove gateway listeners
};
// type data
const updateTypeCacheData = (reference, type) => {
    let cacheitem = getTypeCacheItem(reference);
    cacheitem.document = type;
};
// type listeners
const addTypeCacheListener = (reference, backreference, callback) => {
    let cacheitem = getTypeCacheItem(reference);
    cacheitem.listeners.set(backreference, callback);
};
const removeTypeCacheListener = (reference, backreference) => {
    if (!typecache.has(reference))
        return;
    let cacheitem = typecache.get(reference);
    cacheitem.listeners.delete(backreference);
    if (cacheitem.listeners.size == 0) {
        removeTypeCacheItem(reference); // filter by cache size?
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
            type = typecache.get(document.identity.type).document;
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
    // setTimeout(()=>{
    let cachedata = getDocumentPack(reference);
    // console.log('cachedata fetched, caches', reference, cachedata, documentcache, typecache)
    if (cachedata.document) { // && cachedata.type) { TODO: temp until type never missing
        callback(cachedata.document, cachedata.type, {
            documents: {
                reason: 'newcallback',
                document: true,
                type: true,
            }
        });
    }
    // },1000)
    // setTimeout(()=>{
    //     callback(list,type)
    // },4000)
};
const removeDocumentListener = (token, instanceid) => {
    let reference = getTokenReference(token);
    removeDocumentCacheListener(reference, instanceid);
    // console.log('remove document listener',reference,instanceid,documentcache.size)
};
let application = {
    properties,
    setDocumentListener,
    removeDocumentListener,
};
export default application;
//# sourceMappingURL=application.jsx.map