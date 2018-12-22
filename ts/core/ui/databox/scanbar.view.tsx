// scanbar.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later
'use strict'

import React from 'react'

import Icon from '@material-ui/core/Icon'

import ActionButton from '../common/actionbutton.view'

const ScanBar = props => {

    let { item } = props

    let barStyle:React.CSSProperties = {
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

    let buttonStyle:React.CSSProperties = {
        padding:'0',
        width:'24px',
        height:'24px',
        float:'right',
        marginRight:'4px',
    }
    let iconStyle:React.CSSProperties = {
        border:'1px solid transparent',
        borderRadius:'50%',
        verticalAlign:'middle',
    }

    return <div>
        <div style = {barStyle}>
            <ActionButton 
                icon = 'close'
                disabled 
            />
            <ActionButton 
                icon = 'play_arrow'
                iconStyle = {{color:'green'}}
            />
            <ActionButton 
                icon = 'settings'
                iconStyle = {{color:'green'}}
            />
            <Icon style = {{verticalAlign:'middle'}} className='material-icons'>list</Icon> 
            <span style = {{verticalAlign:'middle'}} >Scan Links</span>
        </div>
    </div>
}

export default ScanBar