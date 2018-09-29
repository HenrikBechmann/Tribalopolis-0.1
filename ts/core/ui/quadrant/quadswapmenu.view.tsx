// swapmenu.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import React from 'react'

import IconButton from '@material-ui/core/IconButton'
import Icon from '@material-ui/core/Icon'
import { withStyles, createStyles } from '@material-ui/core/styles'
import ActionButton from '../common/actionbutton.view'


const styles = createStyles({
    root:{
        position:'absolute',
        right:'0',
        top:'0',
        border:'1px solid silver',
        borderRadius:'0 0 0 8px',
        backgroundColor:'lightgray',
        zIndex:1,
        padding:'3px',
        opacity:0.7,
    },
})

const SwapMenu = ({ quadrantPosition, handleSwap, classes }) => {

    let tilt = null
    if (quadrantPosition == 'topleft' || quadrantPosition == 'bottomright') {
        tilt = '-45deg'
    } else {
        tilt = '45deg'
    }

    return <div 
        className = {classes.root} 
    >
        <ActionButton 
            iconStyle = {{color:'green'}}
            icon = 'swap_vert'
            action = {() => {
                handleSwap(quadrantPosition,'vertical')
            }} />
        <ActionButton 
            iconStyle = {{color:'green',transform:`rotate(${tilt})`}}
            icon = 'swap_vert'
            action = {() => {
                handleSwap(quadrantPosition,'diagonal')
            }} />
        <ActionButton 
            iconStyle = {{color:'green'}}
            icon = 'swap_horiz'
            action = {() => {
                handleSwap(quadrantPosition,'horizontal')
            }} />
    </div>
}

export default withStyles(styles)(SwapMenu)
