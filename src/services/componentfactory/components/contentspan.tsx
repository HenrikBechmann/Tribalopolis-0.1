// contentspan.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

const ContentSpan = props => {

    let importedstyles = props.style || {}
    let localstyles = {border:'2px solid blue',padding:'3px'}
    let classes = props.classes || {}

    return <span>
        {props.children}
    </span>

}

export default ContentSpan