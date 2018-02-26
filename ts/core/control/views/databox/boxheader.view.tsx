// boxheader.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import * as React from 'react'

const BoxHeader = props => {

    let { item } = props

    let boxicon = '/public/icons/databox.svg'

    let styles = {
        width:'100%',
        border:'1px solid silver',
        borderRadius:'8px',
        padding:'3px',
        whitespace:'nowrap',
        overflow:'hidden',
        boxSizing:'border-box',
        marginBottom: '3px',
    }

    return <div style = {styles as any}>
        <img style = {{verticalAlign:'bottom'}} src = {boxicon} /> {item.profile.name}
    </div>
}

export default BoxHeader