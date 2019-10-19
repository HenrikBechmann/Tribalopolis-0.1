// renderer.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

/*
    TODO: attributions gets left behind! Find a way to express attributions

*/
'use strict'

import React from 'react'

import { withStyles, createStyles } from '@material-ui/core/styles'
import moment from 'moment'

import layoutComponents from './componentfactory/layouts'
import displayComponents from './componentfactory/displays'
import formComponents from './componentfactory/forms'
import widgetComponents from './componentfactory/widgets'
import nativeComponents from './componentfactory/native'

import functions from './functions'
import Proxy from '../utilities/docproxy'

import AbstractDataPane from './componentfactory/components/abstractdatapane'
import utilities from '../utilities/utilities'
import { DataPaneNamespace, FactoryNamespace, FactoryMessage, GenericObject } from './interfaces'
import application from './application'

import coredata from  '../data/coredata'

const components = { // lookups
    layouts:layoutComponents,
    displays:displayComponents,
    forms:formComponents,
    widgets:widgetComponents,
    // box:boxComponents
    native:nativeComponents,
}

// instantiated by client
class ComponentFactory {

    // private prerendermessage:PreRenderMessage
    private namespace

    // ==================[ API ]========================

    // a utility to package renderer content message from standard input
    // it namespace together with renderdata from the document type
    public assembleFactoryMessage = (namespace:FactoryNamespace) => {

        let { typepack, options} = namespace

        let renderdata
        try {

            renderdata = typepack.document.properties.ui[options.uiselection]

        } catch(e) {

            console.log('failure to select interface from type',e, namespace)
            return null

        }

        if (!renderdata) return null

        let factorymessage:FactoryMessage = {
            renderdata,
            namespace,
        }

        return factorymessage
    }

    // called by client. 
    // factorymessage has renderdata and namespace (see above)
    // renderdata includes attributions, and componentspecs ('component')

    // TODO: integrate attributions into returned component
    public createUISelection = (factorymessage:FactoryMessage, ref=null) => {

        // console.log('getComponent',factorymessage)
        if (!factorymessage) return null

        const {renderdata,namespace} = factorymessage 

        this.namespace = namespace

        let component = this.assembleComponent(renderdata.component, renderdata.attributions)

        return component

    }

    // =======================[ internal ]============================

    private assembleComponent = (componentspec,attributions = null) => {

        // console.log('assembleComponent',renderdata)

        // if the component is text, return the text
        let { properties, attributes} = componentspec
        attributes = this.getProps(attributes)
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
                    return this.assembleComponent(result)
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
            }

            let [collection,componentclass] = this.getTypeSplit(componentspec.type)
            // contentformstylesmethod

            // get component properties
            let props:GenericObject = this.getProps(componentspec.properties, componentspec.attributes)
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
        let controller = this.namespace.controller
        let agent = this.namespace.agent
        let docproxy = ref && new Proxy({doctoken:{reference:ref}})

        // TODO: this should include props from data source?
        return <AbstractDataPane 
            key = {props.key} 
            docproxy = {docproxy}
            controller = {controller} 
            agent = {agent}
            attributes = {attributes} 
        />
    }

    private getTypeClass = typespec => {

        let [collection, componentclass] = this.getTypeSplit(typespec)
        let type = components[collection][componentclass]
        if (!type) type = typespec // TODO: should be made secure!

        return type

    }

    private getTypeSplit = typespec => {
        let typelist = typespec.split('.')
        let [collection, componentclass] = typelist
        return [collection, componentclass]
    }

/*--------------------[ unpack properties]-------------------*/

    private getProps = (propertyspecs,attributes = null) => {

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

    private getPropertyByFilter = (propertyspec, attributes = null) => {

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

    private getPropertyByObject(propertyobject, attributes = null) {
        let retval = propertyobject
        if (propertyobject['#variant']) {
            let variant = propertyobject['#variant']
            switch (variant) {
                case 'component':
                    retval = this.assembleComponent(propertyobject.component)
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
                case 'namespace':
                    retval = this.namespace
                    break
                default:
                    retval = null
                    break
            }
        }
        return retval
    }

    private getPropertyByIndirection = (propertySpec, attributes = null) => {

        let path = propertySpec.slice(1) // removing '&' trigger
        let pathlist = path.split('.')
        let namespace = this.namespace
        let nodedata:any = utilities.getNodePosition(namespace,pathlist)
        // console.log('pathlist, namespace, propertyspec, attributes, nodedata',pathlist, namespace, propertySpec, attributes, nodedata)
        if (nodedata) {
            let value = nodedata.nodevalue
            let datatype
            if (pathlist[0]=='docpack') { // doctype.document

                let docpath = pathlist.slice(2);
                [value,datatype] = application.filterDataIncomingValue(value,docpath,namespace.typepack.document)

                if (value && (datatype == '??timestamp')) {

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
                let child = this.assembleComponent(childspec)
                children.push(child)
            }
        } else {
            children = this.assembleComponent(childspecs)
        }

        return children

    }

}

export default ComponentFactory
