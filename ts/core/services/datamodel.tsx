// datamodel.tsx
/*
    This is the runtime data model
    It is accessed by controllers (containers)
    The store should be immutable: changes to objects cause replacement, not revision
        of those objects. This allows react to respond to changes simply by checking
        objects.

    TODO:
        - trigger subscriptions to containerstore with changes
*/

enum StoreEndpoints {
    data = "data",
    meta = "meta",
    controls = "controls",
    // data and meta
    nodes = "nodes",
    lists = "lists",
    links = "links",
    schemes = "schemes",
    // controls
    user = "user",
    context = "context",
}

interface genericobject {
    [key:string]:any
}

let getstore = () => {
    return datamodel.store
}

// TODO: for undo/redo add 'past, present, future' properties to undoable sections 
// of the store.
let assertArray = (data) => {
    return Array.isArray(data)?data:[data]
}

let subscribe = (containerpath:string|string[],callback:Function) => {

    let result = findtargetstore(containerpath)

    if (result === false) return result

    let {targetstore}:{targetstore:genericobject} = result

    if (!targetstore.__callbacks__) targetstore.__callbacks__ = []

    targetstore.__callbacks__.push(callback)

}

let publishchange = (container:genericobject, index:string, data:any) => {
    if (container.__callbacks__) {
        let func:Function
        for (func of container.__callbacks__) {
            func(container,index,data)
        }
    }
}

let updateproperty = (containerpath:string|string[], propertyindex:string, contents:any) => {

    let result = findtargetstore(containerpath)

    if (result === false) return result

    let {containerstore, targetstore, targetstoreindex} = result

    if (targetstore[propertyindex] !== contents) {
        
        targetstore = Object.assign({},targetstore) // new object, new pointer
        containerstore[targetstoreindex] = targetstore
        targetstore[propertyindex] = contents

        publishchange(containerstore,targetstoreindex,targetstore)

    }

    return true

}

// create a new property
let createproperty = (containerpath:string|string[], propertyindex:string, contents:any) => {

    let result = findtargetstore(containerpath)

    if (result === false) return result

    let {containerstore, targetstore, targetstoreindex} = result

    if (!(targetstore[propertyindex]===undefined)) {
        console.error('store property aleady exists for create using ',containerpath, propertyindex, contents)
        return false
    }

    // create new store to indicate modification
    targetstore = Object.assign({}, targetstore)
    containerstore[targetstoreindex] = targetstore
    // create new property
    targetstore[propertyindex] = contents

    publishchange(containerstore,targetstoreindex,targetstore)

    return true

}

let deleteproperty = (containerpath:string|string[], propertyindex:string) => {

    let result = findtargetstore(containerpath)

    if (result === false) return result

    let {containerstore, targetstore, targetstoreindex} = result

    if ((targetstore[propertyindex]===undefined)) {
        console.error('no store property found for delete using ',containerpath, propertyindex)
        return false
    }

    // create new store to indicate modification
    targetstore = Object.assign({}, targetstore)
    containerstore[targetstoreindex] = targetstore
    // delete property
    delete targetstore[propertyindex]

    publishchange(containerstore,targetstoreindex,targetstore)

    return true

}

let readproperty = (containerpath:string|string[], propertyindex:string) => {

    let result = findtargetstore(containerpath)

    if (result === false) return undefined

    let {targetstore} = result

    return targetstore[propertyindex]

}

let findtargetstore = (containerpath:string|string[], themodel = datamodel) => {

    if (!containerpath) {
        throw('store operation requires containerpath values')
    }
    let path:string[] = assertArray(containerpath)

    let target = themodel.store
    let container, index

    try {

        for (index in path) {
            container = target
            target = target[index]
        }

    } catch(e) {

        console.error("targetstore not found using ",containerpath)
        return false

    }

    return {containerstore:container, targetstore:target, targetstoreindex:index}

}

export let datamodel = {
    endpoints:StoreEndpoints,
    subscribe,
    getstore,
    updateproperty,
    createproperty,
    deleteproperty,
    readproperty,
    store: {
        data: {
            nodes:{},
            lists:{},
            links:{},
            schemes:{},
        },
        meta:{
            nodes:{},
            lists:{},
            links:{},
            schemes:{},
        },
        controls: {
            user:{},
            context:{},
        },
    }
}
