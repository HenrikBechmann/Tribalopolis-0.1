// actionbutton.view.tsx

// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import * as React from 'react'

import IconButton from 'material-ui/IconButton'
import FontIcon from 'material-ui/FontIcon'

interface propsInterface {
    buttonStyle?:React.CSSProperties,
    iconStyle?:React.CSSProperties
    action?:Function,
    icon:string,
}

const ActionButton = (props:propsInterface) => {

    let defaultButtonStyle:React.CSSProperties = {
        padding:'0',
        width:'24px',
        height:'24px',
        float:'right',
        verticalAlign:'bottom',
        marginRight:'3px'
    }

    let defaultIconStyle:React.CSSProperties = {
        // ...defaultButtonStyle,
    }

    let {buttonStyle, iconStyle, action, icon} = props

    let theButtonStyle = {...defaultButtonStyle, ...buttonStyle}    

    let theIconStyle = {...defaultIconStyle, ...iconStyle}    

    return (
        <IconButton style = {theButtonStyle}
            iconStyle = {theIconStyle}
            onClick = {
                () => {action()}
            }
        >
            <FontIcon className='material-icons'>{icon}</FontIcon> 
        </IconButton>
    )
}

export default ActionButton