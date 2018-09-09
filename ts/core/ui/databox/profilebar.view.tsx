// boxheader.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import React from 'react'

import Icon from '@material-ui/core/Icon'

import ActionButton from '../common/actionbutton.view'

const ProfileBar = props => {

    let { item } = props

    let styles:React.CSSProperties = {
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

    let iconStyle = ():React.CSSProperties => ({
            transform:'rotate(180deg)',
            // transition:'transform 0.5s .1s ease-out',
        }
    )

    return <div style = {styles}>

        <ActionButton 
            icon = 'expand_less' 
            iconStyle = {iconStyle()}
        />
        <Icon style = {{verticalAlign:'middle'}}>subject</Icon> 
        <span style = {{verticalAlign:'middle'}} >Profile</span>
    </div>
}

export default ProfileBar