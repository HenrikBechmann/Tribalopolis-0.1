// dataPane.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

// this is just utilities for datpanes, so we just instantiate on object
// all calls must be functionally pure (same input = same output)

'use strict'

import React from 'react'
import merge from 'deepmerge'

const dataPane = new class {
    getRenderMessage = (document, type, options, container) => {

        console.log('options in getRenderMessage',options,type,document)
        let renderspecs
        try {
            renderspecs = type.properties.ui[options.uiselection]
        } catch(e) {
            return null
        }

        if (!renderspecs) return null

        let data = {
            container,
            props:container.props,
            document,
        }

        let rendermessage = {renderspecs,data}

        return rendermessage
    }
}

export default dataPane