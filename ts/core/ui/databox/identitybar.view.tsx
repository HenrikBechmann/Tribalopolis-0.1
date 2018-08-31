// boxheader.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import * as React from 'react'

import ActionButton from '../common/actionbutton.view'

const BoxHeader = props => {

    let { item } = props

    let avatar = '/public/avatars/henrik_in_circle.png'

    let styles:React.CSSProperties = {
        position:'relative',
        width:'100%',
        border:'1px solid transparent',
        borderRadius:'8px',
        padding:'3px',
        whiteSpace:'nowrap',
        overflow:'hidden',
        boxSizing:'border-box',
        marginBottom: '1px',
        fontSize:'larger',
        backgroundColor:'#f2f2f2',
    }

    return <div style = {styles}>
        <ActionButton 
            icon = 'zoom_out_map' 
        />
        <ActionButton 
            icon = 'info' 
        />
        <img style = {{verticalAlign:'middle',width:'32px', margin:'-3px 0 -3px -3px'}} src = {avatar} /> {item.properties.name}
    </div>
}

export default BoxHeader