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
let tokenvar = null; // TODO: remove this transition item
// ===========[ Document Cache Management ]============
// document cache
const newDocumentCacheItem = () => {
    return {
        data: {
            document: null,
            type: null,
        },
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
        // TODO: update this transition code
        let document = gateway.setDocumentListener(tokenvar);
        let type = gateway.setDocumentListener({ id: document.identity.type.id, collection: 'types' });
        updateDocumentCacheData(reference, document, type);
    }
    return cacheitem;
};
const removeDocumentCacheItem = (reference) => {
    documentcache.delete(reference);
    // TODO: remove gateway listeners
};
// document data
const updateDocumentCacheData = (reference, document, type) => {
    let cacheitem = getDocumentCacheItem(reference);
    cacheitem.data.document = document;
    cacheitem.data.type = type;
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
        type: null,
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
const removeTypeCacheItem = (reference) => {
    typecache.delete(reference);
    // TODO: remove gateway listeners
};
// type data
const updateTypeCacheData = (reference, type) => {
    let cacheitem = getTypeCacheItem(reference);
    cacheitem.type = type;
};
// type listeners
const addTypeCacheListener = (reference, instanceid, callback) => {
    let cacheitem = getTypeCacheItem(reference);
    cacheitem.listeners.set(instanceid, callback);
};
const removeTypeCacheListener = (reference, instanceid) => {
    if (!typecache.has(reference))
        return;
    let cacheitem = typecache.get(reference);
    cacheitem.listeners.delete(instanceid);
    if (cacheitem.listeners.size == 0) {
        removeTypeCacheItem(reference); // filter by cache size?
    }
};
// ===============[ General Utilities ]===============
const getTokenReference = token => {
    return `${token.collection}/${token.id}`;
};
const getDocumentPack = reference => {
    let cachedata = documentcache.get(reference).data;
    return cachedata;
};
// =================[ API ]=======================
const properties = {
    ismobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
};
const setDocumentListener = (token, instanceid, callback) => {
    tokenvar = token; // TODO: temp transition item
    let reference = getTokenReference(token);
    addDocumentCacheListener(reference, instanceid, callback);
    // setTimeout(()=>{
    let cachedata = getDocumentPack(reference);
    if (cachedata.document) { // && cachedata.type) { TODO: temp until type never missing
        callback(cachedata.document, cachedata.type);
    }
    // },1000)
    // setTimeout(()=>{
    //     callback(list,type)
    // },4000)
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