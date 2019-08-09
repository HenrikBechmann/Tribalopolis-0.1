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

    try {
        for (nodeindex of path) {

            nodeproperty = nodevalue
            nodevalue = nodeproperty[nodeindex]

            if (nodevalue === undefined) return undefined// no doc node available

        } 
    } catch (e) {
        return undefined
    }

    return {
        nodeproperty,
        nodeindex,
        nodevalue,
    }

}

const isObject = value => {
    return ((typeof value === 'object') && (value !== null))
}

// from https://stackoverflow.com/questions/5999998/how-can-i-check-if-a-javascript-variable-is-function-type
const isFunction = (functionToCheck) => {
    if (!functionToCheck) return false
    let isFunction = functionToCheck && ({}.toString.call(functionToCheck) === '[object Function]')

    return isFunction
}

export default {
    getJsonFile,
    getNodePosition,
    isObject,
    isFunction,
}

