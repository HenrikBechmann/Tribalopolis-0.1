// renderer.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

import { RenderMessage } from './interfaces'

import layoutComponents from './prerenderer/layouts'
import displayComponents from './prerenderer/displays'
import formComponents from './prerenderer/forms'

const components = {
    layouts:layoutComponents,
    displays:displayComponents,
    forms:formComponents,
}

class PreRenderer {

    constructor(rendermessage) {
        this.rendermessage = rendermessage
    }

    rendermessage:RenderMessage
    specs
    data

    assemble = () => {
        if (!this.rendermessage) return null
            
        const {renderspecs:spec,data} = this.rendermessage 

        this.specs = spec.component
        this.data = data

        let componentClass = this.assembleComponents(this.specs)

        return componentClass

    }

    private assembleComponents = componentspec => {

        console.log('in assembleComponents',componentspec)

        // if the component is text, return the text
        if (componentspec['#istext']) {
            return componentspec.text
        }
        // get component class
        let type = this.getTypeClass(componentspec.type)
        // get component properties
        let props = this.getProps(componentspec.properties)

        let children = this.getChildren(componentspec.children)

        return React.createElement(type, props, children)

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
            let property = this.getProperty(propertyindex,propertyspec)
            props[propertyindex] = property
        }
        return props
    }

    private getProperty = (propertyindex,propertyspec) => {
        return ''
    }

    private getChildren = childrenspec => {
        let children = []
        for (let child of childrenspec) {
            children.push(this.assembleComponents(child))
        }
        return children
    }

}

export default PreRenderer
