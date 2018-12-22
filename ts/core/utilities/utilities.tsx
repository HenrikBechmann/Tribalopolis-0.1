// utilities.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

// declare var fetch

'use strict'

const getJsonFile = (spec) => {
    let promise = new Promise((resolve, error) => {

        fetch(spec).then((jsondata) => {
            return jsondata.json()
        }).then((json)=> {
            resolve(json)
        }).catch((reason)=>{
            error(reason)
        })
    })
    return promise
}

const getNodePosition = (branch, path) => {

    let nodeproperty
    let nodeindex
    let nodevalue = branch

    for (nodeindex of path) {

        nodeproperty = nodevalue
        nodevalue = nodeproperty[nodeindex]

        if (nodevalue === undefined) return undefined// no doc node available

    } // yields comparandproperty and comparandindex of that property

    return {
        nodeproperty,
        nodeindex,
        nodevalue,
    }

}

const isObject = value => {
    return ((typeof value === 'object') && (value !== null))
}

export default {
    getJsonFile,
    getNodePosition,
    isObject,
}