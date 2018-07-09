// store.tsx
/*
    This is the runtime data model
    It is accessed by controllers (containers)
    The store should be immutable: changes to objects cause replacement, not revision
        of those objects. This allows react to respond to changes simply by checking
        objects.
*/

enum StoreEndpoints {
    nodes = "nodes",
    lists = "lists",
    links = "links",
    schemes = "schemes",
    meta = "meta",
    data = "data",
    controls = "controls",
    user = "user",
    context = "context",
}


// TODO: for undo/redo add 'past, present, future' properties to undoable sections 
// of the store.
let assertArray = (data) => {
    return Array.isArray(data)?data:[data]
}

let update = (endpoint:string|string[],index:string,value:any) => {

    if (!endpoint || !index) {
        throw('update store requires endpoint and index values')
    }

    let end = assertArray(endpoint)
    let original = store
    let last, idx
    // there must be at least one idx value in array
    try {
        for (idx in end) {
            last = original
            original = original[idx]
        }
        if (original[index] !== value) {
            let revised = Object.assign({},original)
            revised[index] = value
            last[idx] = revised
        }
    } catch(e) {
        console.error("endpoint or index not found for update store using ",endpoint, index, value)
        return false
    }

    return true

}

// create a new property
let create = (endpoint:string|string[], value:any) => {

    if (!endpoint) {
        throw('create store requires endpoint')
    }
    let end:string[] = assertArray(endpoint)

    let original = store
    let index = end.pop() // the new property
    let idx, last, lastidx

    for (idx in end) {
        if (original[idx]===undefined) {
            if (last && lastidx) {
                // parent will change, therefore take copy
                original = Object.assign({},original)
                // assign to original parent
                last[lastidx] = original
            } 
            // create placeholder
            original[idx] = {}
        }
        last = original
        lastidx = idx
        original = original[idx]
    }
    if (!(original[index]===undefined)) {
        console.error('store property aleady exists for create using ',endpoint, value)
        return false
    }

    // create new property
    original[index] = value
    if (last) {
        // create new parent
        original = Object.assign({},original)
        last[idx] = original
    } // otherwise leave store unchanged
    return true

}

let del = (endpoint) => {

}

let read = (endpoint) => {

}

export let store = {
    endpoints:StoreEndpoints,
    ops: {
        update,
        create,
        del,
        read,
    },
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
