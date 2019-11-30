// utilities.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

// declare var fetch

'use strict'

import React from 'react'

const integrateComponents = (list, namespace) => {

    // console.log('integrateComponents:list, namespace',list, namespace)

    let newchildren = []

    if ( !list || !namespace ) return list?list:newchildren

    if (!Array.isArray(list)) list = [list]
    
    for (let element of list) {
        let dataAttributes = element.props && element.props['data-attributes']

        // console.log('integrateComponents: dataAttributes',dataAttributes)

        if (dataAttributes && dataAttributes.setup) {

            let setup = dataAttributes.setup
            // console.log('integrateComponents: setup',setup)
            if (setup.assignments) {
                let assignments = setup.assignments
                // console.log('integrateComponents: assignments',setup)
                let properties = {}
                for (let property in assignments) {
                    let instruction = assignments[property]
                    let value = unpackProperty(instruction, namespace)
                    properties[property] = value
                    // console.log('integrateComponents: assigned value to property',value, property)
                }
                element = React.cloneElement(element,properties)
                // console.log('new element',element)
            }
        }

        newchildren.push(element)

    }

    return newchildren

}

const updateComponents = (list, namespace) => {

    let newchildren = []

    if ( !list || !namespace ) return list?list:newchildren

    if (!Array.isArray(list)) list = [list]
    
    for (let element of list) {
        // console.log('element in updateComponents',element, list)
        let dataAttributes = (element.props && element.props['data-attributes'])

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
                // console.log('update assignments: assignments, element, namespace',assignments, element, namespace)
                let properties = {}

                for (let property in assignments) {

                    let instruction = assignments[property]
                    let value = unpackProperty(instruction, namespace)
                    // console.log('property, value, instruction', property, value, instruction)

                    properties[property] = value

                }

                // console.log('properties',properties)

                element = React.cloneElement(element,properties)
            }
        }

        newchildren.push(element)

    }

    return newchildren
}

const updateDbState = (list, namespace) => {
    let newchildren = []

    if ( !list || !namespace ) return list?list:newchildren

    if (!Array.isArray(list)) list = [list]
    
    for (let element of list) {
        // console.log('element in updateComponents',element, list)
        let dataAttributes = (element.props && element.props['data-attributes'])

        // console.log('updateFieldsetElementValues',dataAttributes)

        if (dataAttributes && dataAttributes.dbstate) {

            let dbstate = dataAttributes.dbstate
            if (dbstate.assignments) {
                let assignments = dbstate.assignments
                // console.log('update assignments: assignments, element, namespace',assignments, element, namespace)
                let properties = {}

                for (let property in assignments) {

                    let instruction = assignments[property]
                    let value = unpackProperty(instruction, namespace)
                    // console.log('property, value, instruction', property, value, instruction)

                    properties[property] = value

                }

                // console.log('properties',properties)

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
                case 'condition': {
                    let retval
                    if (unpackProperty(propertySpec.if,namespace)) {
                        retval = unpackProperty(propertySpec.then,namespace)
                    } else {
                        retval = this.getPropertyByFilter(propertySpec.else, namespace)
                    }
                    return retval
                    break
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
    updateDbState,
    unpackProperty,

    getJsonFile,
    getNodePosition,
    isObject,
    isFunction,

}

