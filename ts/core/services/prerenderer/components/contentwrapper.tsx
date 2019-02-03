// contentwrapper.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

const ContentWrapper = props => {

    let importedstyles = props.style || {}
    let localstyles = {border:'2px solid blue',padding:'3px'}

    let style = {...localstyles,...importedstyles}

    return <div style = {style}>
        {props.children}
    </div>
}

export default ContentWrapper