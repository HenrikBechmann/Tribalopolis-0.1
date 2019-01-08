// renderer.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

import { RenderMessage } from './interfaces'

import layoutComponents from './prerenderer/layouts'
import displayComponents from './prerenderer/displays'
import formComponents from './prerenderer/forms'

const components = { // lookups
    layouts:layoutComponents,
    displays:displayComponents,
    forms:formComponents,
}

// instantiated by client
class PreRenderer {

    constructor(rendermessage) {

        this.rendermessage = rendermessage

    }

    rendermessage:RenderMessage
    specs
    data

    // called by client
    assemble = () => {

        if (!this.rendermessage) return null
            
        const {renderspecs:spec,data} = this.rendermessage 

        this.specs = spec.component
        this.data = data

        let componentClass = this.assembleComponents(this.specs)

        return componentClass

    }

    private assembleComponents = componentspec => {

        // console.log('in assembleComponents',componentspec)

        // if the component is text, return the text
        if (componentspec['#variant'] && (componentspec['#variant'] == 'text')) {
            return componentspec.text
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

        return type

    }

    private getProps = propertyspecs => {

        let props = {}
        for (let propertyindex in propertyspecs) {
            let propertyspec = propertyspecs[propertyindex]
            let property = this.getProperty(propertyspec)
            props[propertyindex] = property
        }

        // console.log('props in getprops',props)

        return props

    }

    private getProperty = (propertyspec) => {

        let property = propertyspec
        return property

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
