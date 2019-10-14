// utilities.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

// declare var fetch

'use strict'

import React from 'react'

const integrateComponents = (list, namespace) => {

}

const updateComponents = (list, namespace) => {

    let newchildren = []
    
    for (let element of list) {
        let dataAttributes = element.props && element.props['data-attributes']

        // console.log('updateFieldsetElementValues',dataAttributes)

        if (dataAttributes && dataAttributes.update) {

            let update = dataAttributes.update
            let instructions = update.instructions
            if (instructions) {
                let trackvalue = (instructions.indexOf('trackvalue') > -1)
                if (trackvalue) {
                    let statevalue = namespace.local.state.values[element.props.name]
                    let elementvalue = element.props.value
                    if (!Object.is(elementvalue,statevalue)) {
                        element = React.cloneElement(element,{value:statevalue})
                    }
                }
            }

            if (update.assignments) {
                let assignments = update.assignments
                let properties = {}
                for (let property in assignments) {
                    let instruction = assignments[property]
                    let value
                    switch (instruction) {
                        case 'notdirtyflag':{
                            value = !namespace.local.state.dirty
                            break
                        }
                        // case 'isediting': {
                        //     value = namespace.local.state.isediting
                        //     break
                        // }
                        default: {
                            value = unpackProperty(instruction, namespace)
                            console.log('contentform default',instruction, value, namespace)
                        }
                    }
                    properties[property] = value
                }
                element = React.cloneElement(element,properties)
            }
        }

        newchildren.push(element)

    }

    return newchildren
}

const unpackProperty = (propertySpec, namespace) => {

    if (isObject(propertySpec)) {

        if (propertySpec["#variant"]) {

            let variant = propertySpec["#variant"]
            switch (variant) {
                case 'namespace': {
                    return namespace
                }
            }

        }

    }

    let instructions = propertySpec.split(',')
    propertySpec = instructions[0]
    
    if (!(propertySpec[0] == '&')) {

        return propertySpec

    }

    let path = propertySpec.slice(1) // removing '&' trigger
    let pathlist = path.split('.')
    let nodedata:any = getNodePosition(namespace,pathlist)

    // console.log('pathlist, namespace, propertyspec, attributes, nodedata',pathlist, namespace, propertySpec, attributes, nodedata)
    if (nodedata) {
        let value = nodedata.nodevalue

        let operation = instructions[1]
        if (operation) {
            switch (operation) {
                case 'not':{
                    value = !value
                }
            }
        } 

        return value

    } else {

        return undefined

    }

}

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

    integrateComponents,
    updateComponents,
    unpackProperty,

    getJsonFile,
    getNodePosition,
    isObject,
    isFunction,

}

