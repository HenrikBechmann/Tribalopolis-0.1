// renderer.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'
import layoutComponents from './prerenderer/layouts'
import { RenderMessage } from './interfaces'

const layouts = layoutComponents

const components = {
    layouts,
}

class PreRenderer {

    constructor(rendermessage) {
        this.rendermessage = rendermessage
    }

    rendermessage:RenderMessage
    specs
    data

    assemble = () => {
        const {renderspecs:spec,data} = this.rendermessage 

        this.specs = spec.component
        this.data = data

        let componentClass = this.assembleComponents(this.specs)

        return componentClass

    }

    private assembleComponents = componentspec => {
        let assembly
        let component = null

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

        return component
    }

    private getTypeClass = typespec => {
        let typelist = typespec.split('.')
        let [collection, componentclass] = typelist
        let type = components[collection][componentclass]
        return type
    }

    private getProps = propertyspec => {
        return {}
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
