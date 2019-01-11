// renderer.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

import { RenderMessage } from './interfaces'

import layoutComponents from './prerenderer/layouts'
import displayComponents from './prerenderer/displays'
import formComponents from './prerenderer/forms'
import widgetComponents from './prerenderer/widgets'
import nativeComponents from './prerenderer/native'
import utilities from '../utilities/utilities'

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

    constructor(rendermessage) {

        this.rendermessage = rendermessage

    }

    rendermessage:RenderMessage
    componentspecs
    data


    updateRenderMessage = (rendermessage:RenderMessage) => {
        this.rendermessage = rendermessage
    }

    // called by client
    assemble = () => {

        if (!this.rendermessage) return null

        const {renderspecs:specs,data} = this.rendermessage 

        this.componentspecs = specs.component
        this.data = data

        // console.log('data in assemble', this.data)
            
        let componentClass = this.assembleComponents(this.componentspecs)

        return componentClass

    }

    private assembleComponents = componentspec => {

        // console.log('in assembleComponents',componentspec)

        // if the component is text, return the text
        if (componentspec['#variant']) {

            let variant = componentspec['#variant']

            switch (variant) {
                case 'text': {
                    return componentspec.text
                }
                default: {
                    console.log('error: variant in assembleComponents not recognized',variant)
                    return null // variant not recognized
                }
            }

        }

        try {

            // get component class
            let type = this.getTypeClass(componentspec.type)
            // get component properties
            let props = this.getProps(componentspec.properties)
            // get conponent children
            let children = this.getChildren(componentspec.children)
            // pass to React

            let element = React.createElement(type, props, children)

            // console.log('element in assembleComponents',element)
            return element

        } catch(e) {

            console.log('error in assembleComponent:',e)
            return null

        }
    }

    private getTypeClass = typespec => {

        let typelist = typespec.split('.')
        let [collection, componentclass] = typelist
        let type = components[collection][componentclass]
        if (!type) type = typespec // TODO: should be made secure!

        return type

    }

    private getProps = propertyspecs => {

        let props = {}
        for (let propertyindex in propertyspecs) {
            let propertyspec = propertyspecs[propertyindex]
            let property = this.getProperty(propertyspec)
            props[propertyindex] = property
        }

        // console.log('props in getProps',props)

        return props

    }

    private getProperty = (propertyspec) => {

        let property = propertyspec

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

    private getPropertyByIndirection = propertySpec => {

        let path = propertySpec.slice(1)
        let pathlist = path.split('.')
        let data = this.data
        let nodedata = utilities.getNodePosition(data,pathlist)
        // console.log('getPropertyByIndirection',propertySpec,pathlist,nodedata)
        if (nodedata) {
            return nodedata.nodevalue
        } else {
            return undefined
        }
    }

    private getChildren = childspecs => {

        let children = []
        for (let childspec of childspecs) {
            let child = this.assembleComponents(childspec)
            children.push(child)
        }

        return children

    }

}

export default PreRenderer
