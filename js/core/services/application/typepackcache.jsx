// typepackcache.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import domain from '../domain';
import docpackCache from './docpackcache';
// ==============================[ TYPE CACHE ]===============================
const typepackCache = new class {
    constructor() {
        this.cache = new Map();
        // same
        this.newItem = () => {
            let cacheitem = {
                docpack: null,
                listeners: new Map(),
            };
            return cacheitem;
        };
        // different
        this.removeItem = (reference) => {
            // unhook from domain
            let parmblock = { reference };
            domain.removeDocumentListener(parmblock);
            this.cache.delete(reference);
        };
        // same
        this.getItem = (reference) => {
            let cacheitem;
            if (this.cache.has(reference)) {
                cacheitem = this.cache.get(reference);
            }
            else {
                cacheitem = this.newItem();
                this.cache.set(reference, cacheitem);
                let parmblock = {
                    reference, success: this.updateItem, failure: null
                };
                domain.setDocumentListener(parmblock);
            }
            return cacheitem;
        };
        // different
        this.updateItem = ({ docpack, reason }) => {
            let typedoc = docpack || {};
            let cacheitem = this.cache.get(typedoc.reference);
            let listeners = null;
            if (cacheitem) {
                cacheitem.docpack = typedoc;
                listeners = cacheitem.listeners;
            }
            if (listeners) {
                listeners.forEach((callback, key) => {
                    callback(key, reason);
                });
            }
        };
        // different
        this.processDocumentPairListeners = (reference, reason) => {
            docpackCache.processPairListeners(reference, reason);
        };
        // different
        this.addListener = (typereference, documentreference, callback) => {
            let cacheitem = this.getItem(typereference);
            if (!cacheitem.listeners.has(documentreference)) {
                cacheitem.listeners.set(documentreference, callback);
            }
        };
        // different
        this.removeListener = (typereference, documentreference) => {
            if (!this.cache.has(typereference))
                return;
            let cacheitem = this.cache.get(typereference);
            if (cacheitem.listeners) {
                cacheitem.listeners.delete(documentreference);
                if (cacheitem.listeners.size == 0) {
                    this.removeItem(typereference); // TODO: filter by cache size?
                }
            }
        };
    }
};
export default typepackCache;
//# sourceMappingURL=typepackcache.jsx.map