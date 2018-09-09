// actionbutton.view.tsx

// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import React from 'react'

import IconButton from '@material-ui/core/IconButton'
import Icon from '@material-ui/core/Icon'

interface propsInterface {
    buttonStyle?:React.CSSProperties,
    iconStyle?:React.CSSProperties
    action?:Function,
    icon?:string,
    img?:string,
    disabled?:boolean,
    badgequantity?:number,
}

const ActionButton = (props:propsInterface) => {

    let {buttonStyle, iconStyle, action, icon, img, disabled} = props

    let defaultButtonStyle:React.CSSProperties = {
        padding:'0',
        width:'32px',
        height:'32px',
        float:'right',
        verticalAlign:'bottom',
        marginRight:'3px'
    }

    let defaultIconStyle:React.CSSProperties = {
        width:'1em'
    }

    if (!icon) { // it's an image, manual opacity required
        defaultIconStyle = {...defaultIconStyle,...{
            verticalAlign:'middle',
            opacity:disabled?.26:.54 // material ui values: TODO: take these settings from theme
        }}
    }
    let theButtonStyle = {...defaultButtonStyle, ...buttonStyle}    

    let theIconStyle = {...defaultIconStyle, ...iconStyle}

    let iconcomponent = icon?<Icon style = {theIconStyle}>{icon}</Icon>:
    <img style = {theIconStyle} src = {img} />
    let onClickVal = 
        (action && !disabled)
            ?() => {action()}
            :() => {}
    return (
        <IconButton
            style = {theButtonStyle}
            onClick = {onClickVal}
            disabled = {disabled}
        >
            {iconcomponent}
        </IconButton>
    )
}

export default ActionButton