// swapmenu.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import * as React from 'react'

import Icon from '@material-ui/core/Icon'

const SwapMenu = ({ quadrant,handleSwap }) => {

    let tilt = null
    if (quadrant == 'topleft' || quadrant == 'bottomright') {
        tilt = '-45deg'
    } else {
        tilt = '45deg'
    }

    return <div 
        style = {
            {
                position:'absolute',
                height:'26px',
                right:'0',
                top:'0',
                border:'1px solid silver',
                borderRadius:'0 0 0 8px',
                backgroundColor:'lightgray',
                zIndex:1,
                padding:'3px',
                opacity:0.7,
            }
        } 
    >
        <Icon 
            style = {{color:'green',marginRight:'8px',border:'1px solid silver',borderRadius:'50%',}} 
            onClick = {() => {
                handleSwap(quadrant,'vertical')
            }}
        >swap_vert</Icon>
        <Icon 
            style = {{color:'green',margin:'0 8px',border:'1px solid silver',borderRadius:'50%',transform:`rotate(${tilt})`}} 
            onClick = {() => {
                handleSwap(quadrant,'diagonal')
            }}
        >swap_vert</Icon>
        <Icon 
            style = {{color:'green',marginLeft:'8px',border:'1px solid silver',borderRadius:'50%',}} 
            onClick = {() => {
                handleSwap(quadrant,'horizontal')
            }}
        >swap_horiz</Icon>
    </div>
}

export default SwapMenu