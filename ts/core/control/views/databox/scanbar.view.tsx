// scanbar.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import * as React from 'react'

import FontIcon from 'material-ui/FontIcon'
import IconButton from 'material-ui/IconButton'

const ScanBar = props => {

    let { node } = props

    let barStyle:React.CSSProperties = {
        width:'100%',
        border:'1px solid silver',
        borderRadius:'8px',
        padding:'3px',
        whitespace:'nowrap',
        overflow:'hidden',
        boxSizing:'border-box',
        marginBottom: '3px',
        fontSize:'larger',
    }

    let buttonStyle:React.CSSProperties = {
        padding:'0',
        width:'24px',
        height:'24px',
        float:'right',
        marginRight:'4px',
    }
    let iconStyle:React.CSSProperties = {
        border:'1px solid silver',
        borderRadius:'50%',
        verticalAlign:'middle',
    }

    return <div>
        <div style = {barStyle}>
        <IconButton style = {buttonStyle}
            iconStyle = {iconStyle}
            disabled
        >
            <FontIcon color = 'green' className='material-icons'>close</FontIcon> 
        </IconButton>
        <IconButton style = {buttonStyle}
            iconStyle = {iconStyle}
        >
            <FontIcon color = 'green' className='material-icons'>play_arrow</FontIcon> 
        </IconButton>
        <IconButton style = {buttonStyle}
            iconStyle = {iconStyle}
        >
            <FontIcon color = 'green' className='material-icons'>settings</FontIcon> 
        </IconButton>
            <FontIcon style = {{verticalAlign:'middle'}} className='material-icons'>list</FontIcon> 
            <span style = {{verticalAlign:'middle'}} >Scan Activity Records</span>
        </div>
    </div>
}

export default ScanBar