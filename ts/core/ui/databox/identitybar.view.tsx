// boxheader.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import React from 'react'

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
        {false && <ActionButton 
            icon = 'lock' 
        />}
        <ActionButton 
            icon = 'expand_more' 
        />
        <img style = {{verticalAlign:'middle',width:'32px', margin:'0 3px'}} src = {avatar} /> 
        <div style = {
            {
                display:'inline-block',
                verticalAlign:'middle',
                textOverflow: 'ellipsis',
                maxWidth: '63%',
                overflow: 'hidden',
            }
        } >
            {item.properties.name.fullname}
        </div>
    </div>
}

export default BoxHeader