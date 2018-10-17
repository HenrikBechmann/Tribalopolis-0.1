// services.tsx
/*
    This is the high level application controller
    It's main responsibility is to co-ordinate the store and the domain
    application -> datamodel + viewmodel -> domain (gateway) -> firebase

    datamodel and viewmodel are both bypassed
*/
/*
    TODO

*/
import gateway from './gateway';
// ==============[ Internal ]===============
const cache = new Map();
const getNewCacheItem = () => {
    return {
        data: {
            document: null,
            type: null,
        },
        listeners: new Map(),
    };
};
const getTokenReference = (token) => {
    return `${token.collection}/${token.id}`;
};
const getCacheItem = (reference) => {
    let cacheitem;
    if (cache.has(reference)) {
        cacheitem = cache.get(reference);
    }
    else {
        cacheitem = getNewCacheItem();
        cache.set(reference, cacheitem);
    }
    return cacheitem;
};
const addCacheListener = (reference, instanceid, callback) => {
    let cacheitem = getCacheItem(reference);
    cacheitem.listeners.set(instanceid, callback);
};
// =================[ API ]=======================
const properties = {
    ismobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
};
const updateCacheData = (reference, document, type) => {
    let cacheitem = getCacheItem(reference);
    cacheitem.data.document = document;
    cacheitem.data.type = type;
};
const setDocumentListener = (token, instanceid, callback) => {
    let reference = getTokenReference(token);
    addCacheListener(reference, instanceid, callback);
    let document = gateway.setDocumentListener(token);
    let type = gateway.setDocumentListener({ id: document.identity.type.id, collection: 'types' });
    updateCacheData(reference, document, type);
    // setTimeout(()=>{
    let cachedcallback = getCacheItem(reference).listeners.get(instanceid);
    if (cachedcallback) {
        cachedcallback(document, type);
    }
    // },1000)
    // setTimeout(()=>{
    //     callback(list,type)
    // },4000)
};
const removeDocumentListener = (token, instanceid) => {
    let reference = getTokenReference(token);
    if (!cache.has(reference))
        return;
    let cacheitem = cache.get(reference);
    cacheitem.listeners.delete(instanceid);
};
const getDocumentFromCache = reference => {
    let cacheitem;
    if (cache.has(reference)) {
        cacheitem = cache.get(reference).data.document;
    }
    else {
        cacheitem = null;
    }
    return cacheitem;
};
let application = {
    properties,
    setDocumentListener,
    removeDocumentListener,
    getDocumentFromCache,
};
export default application;
//# sourceMappingURL=application.jsx.map