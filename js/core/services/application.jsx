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
import domain from './domain';
const cache = new Map();
const setTypeListener = (token) => {
    return domain.setTypeListener(token);
};
const getNewCacheItem = () => {
    return {
        document: {
            data: null,
            type: null,
        },
        listeners: new Map(),
    };
};
const getTokenPath = (token) => {
    return `${token.repo}/${token.uid}`;
};
const getCacheItem = (path) => {
    let cacheitem;
    if (cache.has(path)) {
        cacheitem = cache.get(path);
    }
    else {
        cacheitem = getNewCacheItem();
        cache.set(path, cacheitem);
    }
    return cacheitem;
};
const addCacheListener = (token, instanceid, callback) => {
    let path = getTokenPath(token);
    let cacheitem = getCacheItem(path);
    cacheitem.listeners.set(instanceid, callback);
};
const updateCacheData = (path, data, type) => {
    let cacheitem = getCacheItem(path);
    cacheitem.document.data = data;
    cacheitem.document.type = type;
};
const setItemListener = (token, instanceid, callback) => {
    addCacheListener(token, instanceid, callback);
    let item = domain.setItemListener(token);
    let type = domain.setTypeListener(item.type);
    let path = getTokenPath(token);
    updateCacheData(path, item, type);
    // setTimeout(()=> {
    callback(item, type);
    // },1000)
    // setTimeout(() => {
    //     console.log('cache',cache)
    // },4000)
};
const removeDocumentListener = (token, instanceid) => {
    let path = getTokenPath(token);
    if (!cache.has(path))
        return;
    let cacheitem = cache.get(path);
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
    let type = domain.setTypeListener(list.type);
    let path = getTokenPath(token);
    updateCacheData(path, list, type);
    // setTimeout(()=>{
    callback(list, type);
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
    setItemListener,
    setListListener,
    removeItemListener,
    removeListListener,
    getLink,
    getScheme,
    getFolder,
    getAccount,
};
export default application;
//# sourceMappingURL=application.jsx.map