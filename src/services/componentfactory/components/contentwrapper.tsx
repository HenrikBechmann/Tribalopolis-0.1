// contentwrapper.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

const ContentWrapper = props => {

    let importedstyles = props.style || {}
    let localstyles = {border:'2px solid blue',padding:'3px'}
    let classes = props.classes || {}

    return <div className = {classes.root} style = {localstyles}>
        {props.children}
    </div>

}

export default ContentWrapper