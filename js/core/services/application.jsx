// services.tsx
/*
    This is the high level application controller
    It's main responsibility is to co-ordinate the store and the domain
    application -> datamodel + viewmodel -> domain (gateway) -> firebase

    datamodel and viewmodel are both bypassed
*/
/*
    TODO separate document and type caches, as type caches should be more reusable

*/
import gateway from './gateway';
// ==============[ Internal ]===============
const cache = new Map();
let tokenvar = null; // TODO: remove this transition item
const newCacheItem = () => {
    return {
        data: {
            document: null,
            type: null,
        },
        listeners: new Map(),
    };
};
const getCacheItem = (reference) => {
    let cacheitem;
    if (cache.has(reference)) {
        cacheitem = cache.get(reference);
    }
    else {
        cacheitem = newCacheItem();
        cache.set(reference, cacheitem);
        console.log('cache size after set new', cache.size, reference);
        // TODO: update this transition code
        let document = gateway.setDocumentListener(tokenvar);
        let type = gateway.setDocumentListener({ id: document.identity.type.id, collection: 'types' });
        updateCacheData(reference, document, type);
    }
    return cacheitem;
};
const removeCacheItem = (reference) => {
    cache.delete(reference);
    console.log('cache size after remove cache', cache.size, reference);
    // TODO: remove gateway listeners
};
const addCacheListener = (reference, instanceid, callback) => {
    let cacheitem = getCacheItem(reference);
    cacheitem.listeners.set(instanceid, callback);
};
const removeCacheListener = (reference, instanceid) => {
    if (!cache.has(reference))
        return;
    let cacheitem = cache.get(reference);
    cacheitem.listeners.delete(instanceid);
    console.log('listener size', cacheitem.listeners.size, reference);
    if (cacheitem.listeners.size == 0) {
        removeCacheItem(reference); // filter by cache size?
    }
};
const updateCacheData = (reference, document, type) => {
    let cacheitem = getCacheItem(reference);
    cacheitem.data.document = document;
    cacheitem.data.type = type;
};
const getTokenReference = (token) => {
    return `${token.collection}/${token.id}`;
};
// =================[ API ]=======================
const properties = {
    ismobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
};
const setDocumentListener = (token, instanceid, callback) => {
    tokenvar = token; // TODO: temp transition item
    let reference = getTokenReference(token);
    addCacheListener(reference, instanceid, callback);
    // setTimeout(()=>{
    let cachedata = cache.get(reference).data;
    // console.log('cachedata',cachedata)
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
    removeCacheListener(reference, instanceid);
};
const getDocumentFromCache = reference => {
    let cachedocument = null;
    if (cache.has(reference)) {
        cachedocument = cache.get(reference).data.document;
    }
    return cachedocument;
};
// combine with getDocumentFrom Cache?
const getTypeFromCache = reference => {
    let cachetype = null;
    if (cache.has(reference)) {
        cachetype = cache.get(reference).data.type;
    }
    return cachetype;
};
let application = {
    properties,
    setDocumentListener,
    removeDocumentListener,
    getDocumentFromCache,
    getTypeFromCache,
};
export default application;
//# sourceMappingURL=application.jsx.map