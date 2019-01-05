// renderer.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

class Renderer {

    constructor(rendertree, path, message) {
        this.rendertree = rendertree
        this.message = message
        this.path = path
    }

    rendertree:Object
    message:Object
    path:string[]

}

export default Renderer
