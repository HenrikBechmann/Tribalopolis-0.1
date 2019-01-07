// contentwrapper.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

const ContentWrapper = props => {

    return <div style = {{border:'2px solid blue'}}>
        Content Wrapper
        <p>{props.children}</p>
    </div>
}

export default ContentWrapper