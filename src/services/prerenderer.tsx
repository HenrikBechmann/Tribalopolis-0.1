// renderer.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

import { withStyles, createStyles } from '@material-ui/core/styles'
import moment from 'moment'

import layoutComponents from './prerenderer/layouts'
import displayComponents from './prerenderer/displays'
import formComponents from './prerenderer/forms'
import widgetComponents from './prerenderer/widgets'
import nativeComponents from './prerenderer/native'

import functions from './functions'

import AbstractDataPane from './prerenderer/components/abstractdatapane'
import utilities from '../utilities/utilities'
import { DataPaneNamespace, GetPreRenderMessage, PreRenderMessage } from './interfaces'
import application from './application'

const components = { // lookups
    layouts:layoutComponents,
    displays:displayComponents,
    forms:formComponents,
    widgets:widgetComponents,
    // box:boxComponents
    native:nativeComponents,
}

// instantiated by client
class PreRenderer {

    // private prerendermessage:PreRenderMessage
    private namespace

    // ==================[ API ]========================

    // a utility to package renderer content message from standard input
    public assemblePreRenderMessage = (getPreRenderMessage:GetPreRenderMessage) => {

        let {docpack, typepack, options, controller} = getPreRenderMessage

        let renderspecs
        try {

            renderspecs = typepack.document.properties.ui[options.uiselection]

        } catch(e) {
            return null

        }

        if (!renderspecs) return null

        let datanamespace:DataPaneNamespace = {
            controller,
            // props:controller.props,
            document:docpack.document,
            type:(typepack && typepack.document),
            functions,
        }

        let prerendermessage:PreRenderMessage = {
            renderspecs,
            namespace:datanamespace,
            docref:docpack.reference
        }

        return prerendermessage
    }

    // called by client
    public getRenderContent = (prerendermessage:PreRenderMessage) => {

        if (!prerendermessage) return null

        const {renderspecs:specs,namespace} = prerendermessage 

        this.namespace = namespace

        let element = this.assembleElement(specs.component)

        return element

    }

    // =======================[ internal ]============================

    private assembleElement = componentspec => {

        // if the component is text, return the text
        let { properties, attributes} = componentspec
        attributes = this.getAttributes(attributes)
        if (componentspec['#variant']) {

            let variant = componentspec['#variant']

            switch (variant) {
                case 'text': {
                    return componentspec.text
                }
                case 'reference': { // recursion
                    return this.getComponentByReference(componentspec.reference, properties, attributes)
                }
                case 'condition':
                    let result
                    if (this.getPropertyByFilter(componentspec.if, attributes)) {
                        result = componentspec.then
                    } else {
                        result = componentspec.else
                    }
                    return this.assembleElement(result)
                default: {
                    console.error('error: variant in assembleComponents not recognized',variant)
                    return null // variant not recognized
                }
            }

        }

        try {

            // get component class
            let type = this.getTypeClass(componentspec.type)

            if (componentspec.attributes && componentspec.attributes.stylesforclasses) {
                let styles = createStyles(componentspec.attributes.stylesforclasses)
                type = withStyles(styles)(type)
                // return component
            }

            // get component properties
            let props = this.getProps(componentspec.properties, componentspec.attributes)
            // get component children
            let children = this.getChildren(componentspec.children)

            // pass to React
            let element = React.createElement(type, props, children)

            return element

        } catch(e) {

            console.log('error in assembleComponents:',e)
            return null

        }
    }

    private getComponentByReference = (reference, properties, attributes) => {

        let ref = this.getPropertyByFilter(reference, attributes)
        let props:any = this.getProps(properties,attributes)
        let namespace = this.namespace
        let { options:opts } = props
        // console.log('props and options derived from db in getComponentByReference',props,opts)
        // console.log('getComponentByReference', reference, properties, ref, opts, dataheap)
        
        return <AbstractDataPane key = {props.key} reference = {ref} options = {opts} namespace = {namespace} attributes = {attributes} />
    }

    private getTypeClass = typespec => {

        let typelist = typespec.split('.')
        let [collection, componentclass] = typelist
        let type = components[collection][componentclass]
        if (!type) type = typespec // TODO: should be made secure!

        return type

    }

/*--------------------[ unpack attributes------------------*/

    private getAttributes = (attributespecs) => {
        let attributes = {}
        for (let attributeindex in attributespecs) {
            let attributespec = attributespecs[attributeindex]
            let attribute = this.getAttributeByFilter(attributespec)
            attributes[attributeindex] = attribute
        }

        return attributes
    }

    private getAttributeByFilter = (attributespec) => {

        let attribute = attributespec

        if (!attribute) return attribute

        if (utilities.isObject(attribute)) {
            return this.getAttributeByObject(attribute)
        }

        let prepend = attribute[0]

        switch (prepend) {

            case '&': {
                attribute = this.getAttributeByIndirection(attributespec)
                break
            }
            case '@': {

                break
            }
        }

        return attribute

    }

    private getAttributeByObject(attributeobject) {
        let retval = attributeobject
        if (attributeobject['#variant']) {
            let variant = attributeobject['#variant']
            switch (variant) {
                case 'component':
                    retval = this.assembleElement(attributeobject.component)
                    break
                
                case 'condition':
                    if (this.getAttributeByFilter(attributeobject.if)) {
                        retval = this.getAttributeByFilter(attributeobject.then)
                    } else {
                        retval = this.getAttributeByFilter(attributeobject.else)
                    }
                    break
                case 'function':
                    let parms = this.getAttributes(attributeobject.parms)
                    retval = functions[attributeobject.function](parms)
                    break
                case 'context':
                    retval = this.namespace
                    break
                default:
                    retval = null
                    break
            }
        }
        return retval
    }

    private getAttributeByIndirection = (attributeSpec) => {

        let path = attributeSpec.slice(1)
        let pathlist = path.split('.')
        let namespace = this.namespace
        let nodedata:any = utilities.getNodePosition(namespace,pathlist)

        if (nodedata) {
            let value = nodedata.nodevalue
            return value
        } else {
            return undefined
        }
    }

/*--------------------[ unpack properties]-------------------*/

    private getProps = (propertyspecs,attributes) => {

        let props = {}
        let defaults = (attributes && attributes.defaults) || {}
        for (let propertyindex in propertyspecs) {
            let propertyspec = propertyspecs[propertyindex]
            let property = this.getPropertyByFilter(propertyspec, attributes)
            if (!property && defaults[propertyindex]) {
                property = defaults[propertyindex]
            }
            props[propertyindex] = property
        }

        return props

    }

    private getPropertyByFilter = (propertyspec, attributes) => {

        let property = propertyspec

        if (!property) return property

        if (utilities.isObject(property)) {
            return this.getPropertyByObject(property, attributes)
        }

        let prepend = property[0]

        switch (prepend) {

            case '&': {
                property = this.getPropertyByIndirection(propertyspec, attributes)
                break
            }
            case '@': {

                break
            }
        }

        return property

    }

    private getPropertyByObject(propertyobject, attributes) {
        let retval = propertyobject
        if (propertyobject['#variant']) {
            let variant = propertyobject['#variant']
            switch (variant) {
                case 'component':
                    retval = this.assembleElement(propertyobject.component)
                    break
                
                case 'condition':
                    if (this.getPropertyByFilter(propertyobject.if, attributes)) {
                        retval = this.getPropertyByFilter(propertyobject.then, attributes)
                    } else {
                        retval = this.getPropertyByFilter(propertyobject.else, attributes)
                    }
                    break
                case 'function':
                    let parms = this.getProps(propertyobject.parms, attributes)
                    retval = functions[propertyobject.function](parms)
                    break
                case 'context':
                    retval = this.namespace
                    break
                default:
                    retval = null
                    break
            }
        }
        return retval
    }

    private getPropertyByIndirection = (propertySpec, attributes) => {

        let path = propertySpec.slice(1)
        let pathlist = path.split('.')
        let namespace = this.namespace
        let nodedata:any = utilities.getNodePosition(namespace,pathlist)

        if (nodedata) {
            let value = nodedata.nodevalue
            let datatype
            if (pathlist[0]=='document') {
                let docpath = pathlist.slice(1);
                [value,datatype] = application.filterDataIncomingValue(value,docpath,namespace.type)
                if (value && (datatype == '??timestamp')) {
                    // console.log('??timestamp property',attributes,application.systemdata)
                    let format = attributes && attributes.formats && attributes.formats.timestamp
                    if (!format) {
                        format = application.systemdata.parameters.properties.dateformat
                    }
                    if (format) {
                        value = moment(value).format(format)
                    }
                }
            }
            return value
        } else {
            return undefined
        }
    }

    /*-------------------[ children ]-----------------*/

    private getChildren = childspecs => {

        if (!childspecs) return null
        let children
        if (Array.isArray(childspecs)) {
            children = []
            for (let childspec of childspecs) {
                let child = this.assembleElement(childspec)
                children.push(child)
            }
        } else {
            children = this.assembleElement(childspecs)
        }

        return children

    }

}

export default PreRenderer
