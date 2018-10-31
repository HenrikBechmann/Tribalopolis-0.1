// services.tsx
/*
    This is the high level application controller
    It's main responsibility is to co-ordinate the store and the domain
    application -> datamodel + viewmodel -> domain (gateway) -> firebase

    datamodel and viewmodel are both bypassed
*/
/*
    TODO:

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
import gateway from './gateway';
// ==============[ Internal ]===============
/*
    Each document has an accompanying type. Types are shared, therefore far less numerous.
    The separation of the two allows for separate caching strategies.
*/
const documentcache = new Map();
const typecache = new Map();
const debug = false; // show console messages
const debug2 = false;
const sentinels = {};
// ===========[ Document Cache Management ]============
/*
    There is a separate set of methods for each of the document and type caches.
*/
// adds a document listener to be updated when a document changes or is set
const addDocumentCacheListener = (reference, instanceid, callback) => {
    let cacheitem = getDocumentCacheItem(reference);
    // console.log('adding document listener',instanceid)
    cacheitem.listeners.set(instanceid, callback);
    debug && console.log('created document cache LISTENER', reference, cacheitem.listeners);
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
        (debug || debug2) && console.log('GET DocumentCacheItem', reference);
        cacheitem = documentcache.get(reference);
    }
    else { // create if doesn't exist
        (debug || debug2) && console.log('MAKE DocumentCacheItem', reference);
        cacheitem = newDocumentCacheItem();
        documentcache.set(reference, cacheitem);
        // connect to data source
        gateway.setDocumentListener(reference, processDocumentCallbackFromGateway);
    }
    return cacheitem;
};
// -----------[ document and type cache flow ]-----------
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
    callback from gateway. This sets or updates the document value, and calls
    callbacks registered for the document. Since every document requires a type,
    it also sets up a listener for the document type, such that update or setup of
    the type causes the document listeners to be udpated.

    if there is no type yet recorded, callbacks will not be processed.
*/
const processDocumentCallbackFromGateway = (reference, document, change) => {
    debug && console.log('process document callback from gateway', reference);
    // set or update document
    let cacheitem = documentcache.get(reference);
    if (!cacheitem)
        return; // async
    cacheitem.document = document;
    let typeref = document.identity.type; // all documents have a type
    // will only create if doesn't already exist
    addTypeCacheListener(typeref, reference, processDocumentCallbacksFromType);
    // will not process without type
    processDocumentCallbacks(reference, change);
};
const addTypeCacheListener = (typereference, documentreference, callback) => {
    let cacheitem = getTypeCacheItem(typereference);
    debug && console.log("add TypeCacheListener", typereference, documentreference, cacheitem);
    if (!cacheitem.listeners.has(documentreference)) {
        cacheitem.listeners.set(documentreference, callback);
        debug && console.log('created type cache LISTENER', cacheitem.listeners);
    }
};
const getTypeCacheItem = (reference) => {
    let cacheitem;
    if (typecache.has(reference)) {
        debug && console.log('get TypeCacheItem', reference);
        cacheitem = typecache.get(reference);
    }
    else {
        debug && console.log('create TypeCacheItem', reference);
        cacheitem = newTypeCacheItem();
        typecache.set(reference, cacheitem);
        gateway.setDocumentListener(reference, processTypeCallbacksFromGateway);
    }
    return cacheitem;
};
const newTypeCacheItem = () => {
    return {
        document: null,
        listeners: new Map(),
    };
};
const processTypeCallbacksFromGateway = (reference, type, change) => {
    debug && console.log('initializing type callback from gateway', reference);
    let typedoc = type || {};
    let cacheitem = typecache.get(reference);
    let listeners = null;
    if (cacheitem) {
        cacheitem.document = typedoc;
        listeners = cacheitem.listeners;
    }
    debug && console.log('data: type cache item listeners', listeners);
    if (listeners) {
        listeners.forEach((callback, key) => {
            debug && console.log('processing callback from type for ', key);
            let slist = sentinels[key];
            if (slist) {
                let slocallist = slist[key];
                if (slocallist && slocallist[slocallist.length - 1]) {
                    callback(key, change);
                }
            }
        });
    }
};
/*
    triggers document callbacks when the document's type is first set, or is updated.
*/
const processDocumentCallbacksFromType = (reference, change) => {
    debug && console.log('document callback from type', reference);
    processDocumentCallbacks(reference, change);
};
/*
    processes a document's callbacks, whether called as the result of a
    document update from the gateway, or a document's type update from the gateway.
    listeners are not updated if there is not yet a type, or a type cache item
*/
const processDocumentCallbacks = (reference, change) => {
    debug && console.log('initializing document callbacks', reference);
    let documentcacheitem = documentcache.get(reference);
    // let document = documentcacheitem.document
    // let typeref = document.identity.type
    debug && console.log('calling getDocumentPack from processDocumentCallbacks', reference);
    let { document, type } = getDocumentPack(reference);
    if (type) {
        let listeners = documentcacheitem.listeners;
        debug && console.log('processing document callbacks', reference, listeners);
        listeners.forEach((callback, key) => {
            let slist = sentinels[key];
            if (slist) {
                let slocallist = slist[key];
                if (slocallist && slocallist[slocallist.length - 1]) {
                    callback(document, type, change);
                }
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
    gateway.removeDocumentListener(reference);
    // anticipate need for type cache listener...
    let documentcacheitem = documentcache.get(reference);
    documentcache.delete(reference);
    debug && console.log('removed document cache item', reference, documentcache);
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
    debug && console.log('removing document cache listener', reference, instanceid, cacheitem);
    if (cacheitem.listeners) {
        cacheitem.listeners.delete(instanceid);
        if (cacheitem.listeners.size == 0) {
            removeDocumentCacheItem(reference); // filter by cache size?
        }
    }
};
const removeTypeCacheItem = (reference) => {
    // unhook from gateway
    gateway.removeDocumentListener(reference);
    typecache.delete(reference);
    debug && console.log('removed type cache item', reference, typecache);
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
    debug && console.log('removed type cache listener', typereference, documentreference, cacheitem);
};
// ===============[ General Utilities ]===============
const getTokenReference = token => {
    return `/${token.collection}/${token.id}`;
};
const getDocumentPack = reference => {
    let cachedocument = documentcache.get(reference);
    let document = cachedocument ? cachedocument.document : null;
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
    (debug || debug2) && console.log('returning Document PACK', reference, cachedata);
    return cachedata;
};
// =================[ API ]=======================
const properties = {
    ismobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
};
// called from component componentDidMount or componentWillUpdate
const setDocumentListener = (token, instanceid, callback) => {
    // if (sentinels[instanceid] !== undefined) return
    // console.log('setting false sentinel for ', instanceid)
    setTimeout(() => {
        let reference = getTokenReference(token);
        addDocumentCacheListener(reference, instanceid, callback);
        debug && console.log('calling getDocumentPack from setDocumentListener', instanceid, reference);
        let cachedata = getDocumentPack(reference);
        console.log('setting listener', reference, instanceid, sentinels[instanceid], sentinels);
        let sentinel = sentinels[instanceid]
            ? sentinels[instanceid][0]
            : undefined;
        console.log('setting sentinel value = ', sentinel);
        if (sentinel === undefined) { // create listener
            sentinels[instanceid] = [false]; // allow continuation with set listener
            console.log('create sentinel = false; continue', sentinels[instanceid]);
        }
        else if (sentinel === true) { // stop was set; clear sentinal; abandon
            console.log('length of instance sentinels BEFORE', sentinels[instanceid].length, sentinels[instanceid]);
            sentinels[instanceid].splice(0, 1);
            console.log('length of instance sentinels AFTER', sentinels[instanceid].length, sentinels[instanceid]);
            if (sentinels[instanceid].length === 0) {
                console.log('deleting sentinels for', instanceid);
                delete sentinels[instanceid];
            }
            console.log('remove sentinel, return, value of sentinel = ', sentinels[instanceid]);
            return;
        }
        else { // sentinel = false; continue with set listener
            sentinels[instanceid].push(false);
            console.log('add sentinel, continue, value of sentinel = ', sentinels[instanceid]);
        }
        console.log('continuing with set', sentinels[instanceid], sentinels);
        // if (sentinels[instanceid] === false) {
        if (cachedata.document && cachedata.type) { // defer if waiting for type
            debug && console.log('IMMEDIATE callback', reference);
            // setTimeout(()=>{
            callback(cachedata.document, cachedata.type, {
                documents: {
                    reason: 'newcallback',
                    document: true,
                    type: true,
                }
            });
            // })
        }
        // } 
    });
};
// called from compoent componentWillUnmount
const removeDocumentListener = (token, instanceid) => {
    let reference = getTokenReference(token);
    console.log('remove listener', reference, instanceid, sentinels[instanceid], sentinels);
    let sentinel = sentinels[instanceid]
        ? sentinels[instanceid][0]
        : undefined;
    console.log('removal sentinel value =', sentinel);
    if (sentinel === undefined) { // create sentinal; set before listener
        sentinels[instanceid] = [true];
        console.log('create sentinal, return; sentinels[instanceid] = ', sentinels[instanceid]);
        return;
    }
    else if (sentinel === false) { // clear sentinal; continue delete listener
        sentinels[instanceid].shift();
        if (sentinels[instanceid].length === 0) {
            console.log('deleting sentinels for', instanceid);
            delete sentinels[instanceid];
        }
        console.log('clear sentinal, continue; sentinels[instanceid] = ', sentinels[instanceid]);
    }
    else { // sentinal === true; was set for previous call; queue next
        sentinels[instanceid].push(true);
        console.log('add sentinal, continue; sentinels[instanceid] = ', sentinels[instanceid]);
        return;
    }
    console.log('continuing with remove; sentinels[instanceid] = ', sentinels[instanceid], sentinels);
    // setTimeout(()=>{
    removeDocumentCacheListener(reference, instanceid);
    // })
};
const getDocument = (reference, callback, errorback) => {
    gateway.getDocument(reference, callback, errorback);
};
const setDocument = (reference, data, success, failure) => {
    gateway.setDocument(reference, data, success, failure);
};
let application = {
    properties,
    setDocumentListener,
    removeDocumentListener,
    getDocument,
    setDocument,
};
export default application;
//# sourceMappingURL=application.jsx.map