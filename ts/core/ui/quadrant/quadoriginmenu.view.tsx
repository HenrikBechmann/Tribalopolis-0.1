// swapmenu.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import React from 'react'

import ActionButton from '../common/actionbutton.view'
import Divider from '@material-ui/core/Divider'
import { withStyles, createStyles } from '@material-ui/core/styles'

const styles = createStyles({
    root:{
        position:'absolute',
        top:'100%',
        border:'1px solid silver',
        borderRadius:'0 8px 8px 0',
        backgroundColor:'lightgray',
        zIndex:1,
        padding:'3px',
        opacity:0.7,
        width:'32px',
    },

})

const OriginMenu = (props) => {

    let { stackpointer:pointer, stackdepth:depth, classes } = props

    return <div 
        className = {classes.root}
    >
        <ActionButton 
            icon = 'arrow_back'
            disabled = {pointer == 0}
            action = {props.decrementStackSelector}
        />
        <ActionButton 
            icon = 'arrow_forward'
            disabled = {(pointer + 1) == depth}
            action = {props.incrementStackSelector}
        />

        <Divider style = {{float:'right',width:'100%'}}/>

        <ActionButton 
            icon = 'menu'
        />

    </div>
}

export default withStyles(styles)(OriginMenu)
