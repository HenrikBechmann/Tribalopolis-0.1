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

import gateway from './gateway'

// ==============[ Internal ]===============

const documentcache = new Map()
const typecache = new Map()


let tokenvar = null // TODO: remove this transition item

const newCacheItem = () => {
    return {
        data:{
            document:null,
            type:null,
        },
        listeners:new Map(),
    }
}

const getCacheItem = (reference) => {
    let cacheitem
    if (documentcache.has(reference)) {

        cacheitem = documentcache.get(reference)

    } else {

        cacheitem = newCacheItem()
        documentcache.set(reference,cacheitem)

        // console.log('cache size after set new', cache.size, reference, cache)

        // TODO: update this transition code
        let document = gateway.setDocumentListener(tokenvar)
        let type = gateway.setDocumentListener({id:document.identity.type.id,collection:'types'})

        updateCacheData(reference,document,type)

    }
    return cacheitem
}

const removeCacheItem = (reference) => {
    documentcache.delete(reference)
    // console.log('cache size after remove cache', cache.size, reference, cache)
    // TODO: remove gateway listeners
}

const addCacheListener = (reference,instanceid,callback) => {

    let cacheitem = getCacheItem(reference)

    cacheitem.listeners.set(instanceid,callback)
    // console.log('listener size after add',cacheitem.listeners.size,reference, instanceid)

}

const removeCacheListener = (reference, instanceid) => {
    if (!documentcache.has(reference)) return
    let cacheitem = documentcache.get(reference)
    cacheitem.listeners.delete(instanceid)
    // console.log('listener size after remove',cacheitem.listeners.size,reference, instanceid)
    if (cacheitem.listeners.size == 0) {
        removeCacheItem(reference) // filter by cache size?
    }
}

const updateCacheData = (reference,document,type) => {
    let cacheitem = getCacheItem(reference)
    cacheitem.data.document = document
    cacheitem.data.type = type
}

const getTokenReference = (token) => {
    return `${token.collection}/${token.id}`
}

// =================[ API ]=======================

const properties = {
    ismobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
}

const setDocumentListener = (token,instanceid,callback) => {

    tokenvar = token // TODO: temp transition item

    let reference = getTokenReference(token)

    addCacheListener(reference,instanceid,callback)
    // setTimeout(()=>{

        let cachedata = documentcache.get(reference).data

        // console.log('cachedata',cachedata)
        if (cachedata.document) { // && cachedata.type) { TODO: temp until type never missing
            callback(cachedata.document, cachedata.type)
        }

    // },1000)
    // setTimeout(()=>{
    //     callback(list,type)
    // },4000)

}

const removeDocumentListener = (token, instanceid) => {

    let reference = getTokenReference(token)
    removeCacheListener(reference,instanceid)
}

const getDocumentFromCache = reference => {
    let cachedocument = null

    if (documentcache.has(reference)) {

        cachedocument = documentcache.get(reference).data.document

    }

    return cachedocument
}

// combine with getDocumentFrom Cache?
const getTypeFromCache = reference => {
    let cachetype = null

    if (documentcache.has(reference)) {

        cachetype = documentcache.get(reference).data.type

    }

    return cachetype
}

let application = {
    properties,
    setDocumentListener,
    removeDocumentListener,
    getDocumentFromCache,
    getTypeFromCache,
}

export default application