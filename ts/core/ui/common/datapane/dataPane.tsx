// dataPane.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

// this is just utilities for datpanes, so we just instantiate on object
// all calls must be functionally pure (same input = same output)

'use strict'

import React from 'react'

const dataPane = new class {
    getRenderingMessage = (document, type, component, datacontext) => {
        let rendermessage = {document,type,datacontext}

        return rendermessage
    }
}

export default dataPane