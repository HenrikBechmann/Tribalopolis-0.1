// dataPane.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

// this is just utilities for datpanes, so we just instantiate on object
// all calls must be idempotent

'use strict'

import React from 'react'

const dataPane = new class {
    getRenderingData = (document, type, context) => {
        let renderingdata = {}

        return renderingdata
    }
}

export default dataPane