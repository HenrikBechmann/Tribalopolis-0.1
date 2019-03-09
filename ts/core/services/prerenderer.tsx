// renderer.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

import { withStyles, createStyles } from '@material-ui/core/styles'

import { PreRenderContext } from './interfaces'

import layoutComponents from './prerenderer/layouts'
import displayComponents from './prerenderer/displays'
import formComponents from './prerenderer/forms'
import widgetComponents from './prerenderer/widgets'
import nativeComponents from './prerenderer/native'

import AbstractDataPane from './prerenderer/components/abstractdatapane'
import utilities from '../utilities/utilities'
import { DataPaneNamespace, GetPreRenderContext } from './interfaces'

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

    // private prerendermessage:PreRenderContext
    private data


    // ==================[ API ]========================

    // a utility to package renderer content message from standard input
    public assemblePreRenderContext = (assemblePreRenderContext:GetPreRenderContext) => {

        let {docpack, typepack, options, container} = assemblePreRenderContext

        // console.log('options in assemblePreRenderContext',options,typepack,docpack,container)
        
        let renderspecs
        try {
            renderspecs = typepack.document.properties.ui[options.uiselection]
            // console.log('renderspecs in assemblePreRenderContext', renderspecs)
        } catch(e) {
            return null
        }

        if (!renderspecs) return null

        let datanamespace:DataPaneNamespace = {
            container,
            props:container.props,
            document:docpack.document,
            type:(typepack && typepack.document)
        }

        let prerendercontext:PreRenderContext = {
            renderspecs,
            data:datanamespace,
            docref:docpack.reference
        }

        // console.log('assemblePreRenderContext prerendermessage',prerendermessage)

        return prerendercontext
    }

    // called by client
    public getRenderContent = (prerendermessage:PreRenderContext) => {

        // console.log('in getRenderContent: prerendermessage',this.prerendermessage)

        if (!prerendermessage) return null

        const {renderspecs:specs,data} = prerendermessage 

        this.data = data

        // console.log('data in assemble', this.data)
            
        let element = this.assembleElement(specs.component)

        return element

    }

    // =======================[ internal ]============================

    private assembleElement = componentspec => {

        // console.log('componentspec in assembleComponents',componentspec)
        // if the component is text, return the text
        if (componentspec['#variant']) {

            // console.log('in assembleComponents for #variant: componentspec',componentspec)

            let variant = componentspec['#variant']

            switch (variant) {
                case 'text': {
                    return componentspec.text
                }
                case 'reference': { // recursion
                    return this.getComponentByReference(componentspec.reference, componentspec.properties, componentspec.attributes)
                }
                default: {
                    console.log('error: variant in assembleComponents not recognized',variant)
                    return null // variant not recognized
                }
            }

        }

        try {

            // console.log('componentspec in AssembleComponents',componentspec)

            // get component class
            let type = this.getTypeClass(componentspec.type)

            if (componentspec.attributes && componentspec.attributes.stylesforclasses) {
                let styles = createStyles(componentspec.attributes.stylesforclasses)
                type = withStyles(styles)(type)
                // console.log('class and withStyles component in getRenderContent',componentClass,component)
                // return component
            }

            // get component properties
            let props = this.getProps(componentspec.properties, componentspec.attributes)
            // get conponent children
            let children = this.getChildren(componentspec.children)
            // pass to React

            // console.log('component arguments',componentspec.type,componentspec.properties,props,children)

            let element = React.createElement(type, props, children)

            // console.log('element in assembleComponents',element)

            return element

        } catch(e) {

            console.log('error in assembleComponents:',e)
            return null

        }
    }

    getComponentByReference = (reference, properties, attributes) => {

        let ref = this.getPropertyByFilter(reference)
        let props:any = this.getProps(properties,attributes)
        let dataheap = this.data
        let { options:opts } = props
        // console.log('props and options derived from db in getComponentByReference',props,opts)
        // console.log('getComponentByReference', reference, properties, ref, opts, dataheap)
        
        return <AbstractDataPane key = {props.key} reference = {ref} options = {opts} data = {dataheap}  />
    }

    private getTypeClass = typespec => {

        // console.log('in getTypeClass: typespec',typespec, components)

        let typelist = typespec.split('.')
        let [collection, componentclass] = typelist
        let type = components[collection][componentclass]
        if (!type) type = typespec // TODO: should be made secure!

        return type

    }

    private getProps = (propertyspecs,attributes = {} as any) => {

        // console.log('getProps',propertyspecs,attributes)

        let props = {}
        let defaults = attributes.defaults || {}
        for (let propertyindex in propertyspecs) {
            let propertyspec = propertyspecs[propertyindex]
            let property = this.getPropertyByFilter(propertyspec)
            if (!property && defaults[propertyindex]) {
                property = defaults[propertyindex]
            }
            props[propertyindex] = property
        }

        // console.log('props in getProps',props)

        return props

    }

    private getPropertyByFilter = (propertyspec) => {

        let property = propertyspec

        if (!property) return property

        if (utilities.isObject(property)) {
            return this.getPropertyByObject(property)
        }

        let prepend = property[0]

        switch (prepend) {

            case '&': {
                property = this.getPropertyByIndirection(propertyspec)
                break
            }
            case '@': {

                break
            }
        }

        return property

    }

    private getPropertyByObject(propertyobject) {
        let retval = propertyobject
        if (propertyobject['#variant']) {
            let variant = propertyobject['#variant']
            switch (variant) {
                case 'component':
                    retval = this.assembleElement(propertyobject.component)
                    break
                
                case 'condition':
                    if (this.getPropertyByFilter(propertyobject.if)) {
                        retval = this.getPropertyByFilter(propertyobject.then)
                    } else {
                        retval = this.getPropertyByFilter(propertyobject.else)
                    }
                    break
                default:
                    retval = null
                    break
            }
        }
        return retval
    }

    private getPropertyByIndirection = propertySpec => {

        let path = propertySpec.slice(1)
        let pathlist = path.split('.')
        let data = this.data
        let nodedata:any = utilities.getNodePosition(data,pathlist)
        // console.log('getPropertyByIndirection',propertySpec,pathlist,nodedata, data)
        if (nodedata) {
            return nodedata.nodevalue
        } else {
            return undefined
        }
    }

    private getChildren = childspecs => {

        // console.log('getChildren childspecs',childspecs)
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
