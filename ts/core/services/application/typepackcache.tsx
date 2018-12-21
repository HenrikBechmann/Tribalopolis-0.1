// typepackcache.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence

'use strict'

import domain from '../domain'
import { 
    SetGatewayListenerMessage,
    ReturnDocPackMessage,
    DocTokenStruc, 
    DocPackStruc,
    CacheItemStruc,
} from '../interfaces'

// ==============================[ TYPE CACHE ]===============================

const typepackCache = new class {
    private cache = new Map()

    private newItem = () => {

        let cacheitem:CacheItemStruc = {
            docpack:null,
            listeners:new Map(),
        }

        return cacheitem

    }

    private removeItem = reference => {

        // unhook from domain
        let parmblock:DocTokenStruc = {reference}
        domain.removeDocumentListener(parmblock)

        this.cache.delete(reference)

    }

    private getItem = reference => { // type reference
        let cacheitem

        if (this.cache.has(reference)) {

            cacheitem = this.cache.get(reference)

        } else {

            cacheitem = this.newItem()
            this.cache.set(reference,cacheitem)

            let parmblock: SetGatewayListenerMessage = {
                reference, success:this.updateItem,failure:null
            }
            domain.setDocumentListener(parmblock)

        }

        return cacheitem
        
    }

    updateItem = ( {docpack, reason}:ReturnDocPackMessage ) => {

        let typedoc = docpack || ({} as DocPackStruc)
        let cacheitem = this.cache.get(typedoc.reference)
        let listeners = null

        if (cacheitem) {

            cacheitem.docpack = typedoc
            listeners = cacheitem.listeners

        }

        if (listeners) {

            listeners.forEach((callback,key) => {

                callback(key,reason)

            })
        }

    }

    addListener = (typereference, documentreference, callback) => {

        let cacheitem = this.getItem(typereference)

        if (!cacheitem.listeners.has(documentreference)) {

            cacheitem.listeners.set(documentreference,callback)

        }
    }

    removeListener = (typereference, documentreference) => {

        if (!this.cache.has(typereference)) return

        let cacheitem = this.cache.get(typereference)

        if (cacheitem.listeners) {

            cacheitem.listeners.delete(documentreference)

            if (cacheitem.listeners.size == 0) {

                this.removeItem(typereference) // TODO: filter by cache size?

            }

        }

    }

    getCacheDocpack = reference => {

        let cacheitem = this.getItem(reference)
        let docpack:DocPackStruc = cacheitem?cacheitem.docpack:{}
        return docpack
    }

}

export default typepackCache
