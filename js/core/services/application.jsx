// services.tsx
/*
    This is the high level application controller
    It's main responsibility is to co-ordinate the store and the domain
    application -> datamodel + viewmodel -> domain (gateway) -> firebase

    datamodel and viewmodel are both bypassed
*/
/*
    TODO
    - consider abstracting to a sing setDocumentListener and removeDocumentListener

*/
// import Datamodel from './datamodel'
import domain from './gateway';
const cache = new Map();
const properties = {
    ismobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
};
const setTypeListener = (token) => {
    return domain.setTypeListener(token);
};
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
    return `${token.repo}/${token.uid}`;
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
const getItemFromCache = reference => {
    let cacheitem;
    if (cache.has(reference)) {
        cacheitem = cache.get(reference).data.document;
    }
    else {
        cacheitem = null;
    }
    return cacheitem;
};
const addCacheListener = (token, instanceid, callback) => {
    let reference = getTokenReference(token);
    let cacheitem = getCacheItem(reference);
    cacheitem.listeners.set(instanceid, callback);
};
const updateCacheData = (reference, data, type) => {
    let cacheitem = getCacheItem(reference);
    cacheitem.data.document = data;
    cacheitem.data.type = type;
};
const setItemListener = (token, instanceid, callback) => {
    addCacheListener(token, instanceid, callback);
    let item = domain.setItemListener(token);
    let type = domain.setTypeListener(item.identity.type.id);
    let reference = getTokenReference(token);
    updateCacheData(reference, item, type);
    // setTimeout(()=> {
    let cacheditem = getCacheItem(reference);
    let cachedcallback = cacheditem.listeners.get(instanceid);
    if (cachedcallback) {
        cachedcallback(item, type);
    }
    // },1000)
    // setTimeout(() => {
    //     console.log('cache',cache)
    // },4000)
};
const removeDocumentListener = (token, instanceid) => {
    let reference = getTokenReference(token);
    if (!cache.has(reference))
        return;
    let cacheitem = cache.get(reference);
    cacheitem.listeners.delete(instanceid);
};
const removeItemListener = (token, instanceid) => {
    removeDocumentListener(token, instanceid);
    // setTimeout(() => {
    //     console.log('cache after remove',cache)
    // },6000)
};
const removeListListener = (token, instanceid) => {
    removeDocumentListener(token, instanceid);
};
const setListListener = (token, instanceid, callback) => {
    addCacheListener(token, instanceid, callback);
    let list = domain.setListListener(token);
    let type = domain.setTypeListener({ uid: list.identity.type.id, repo: 'lists' });
    let reference = getTokenReference(token);
    updateCacheData(reference, list, type);
    // setTimeout(()=>{
    let cachedcallback = getCacheItem(reference).listeners.get(instanceid);
    if (cachedcallback) {
        cachedcallback(list, type);
    }
    // },1000)
    // setTimeout(()=>{
    //     callback(list,type)
    // },4000)
};
const getScheme = (token) => {
    return domain.getScheme(token);
};
const getLink = (token) => {
    return domain.getLink(token);
};
const getFolder = (token) => {
    return domain.getFolder(token);
};
const getAccount = (token) => {
    return domain.getAccount(token);
};
let application = {
    properties,
    setItemListener,
    setListListener,
    removeItemListener,
    removeListListener,
    getItemFromCache,
    getLink,
    getScheme,
    getFolder,
    getAccount,
};
export default application;
//# sourceMappingURL=application.jsx.map