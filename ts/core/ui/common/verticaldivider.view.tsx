// verticaldivider.view.tsx

// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later
'use strict'

import React from 'react'

const VerticalDivider = (props) => {
    let defaultstyle = {
        display:'inline-block',
        height:'1.5em',
        borderLeft:'1px solid gray',
        verticalAlign:'middle',
    }
    let appliedstyle = Object.assign({},defaultstyle,props.style)
    return (
        <div style = {
            appliedstyle
        }></div>
    )
}

export default VerticalDivider