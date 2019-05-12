// quadbasket.view.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later
'use strict'

import React from 'react'

import {withStyles, createStyles} from '@material-ui/core/styles'

const styles = createStyles({
    quadbasket: {
        position:'absolute',
        top:0,
        right:0,
        width:'96px',
        height:'48px',
        backgroundColor:'brown',
        zIndex:1,
        borderRadius: '8px',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        cursor:'pointer',
    },
    transfermoniker:{
        textAlign:'center',
        fontWeight:'bold',
        color:'gray',
        opacity:0.7,
    },
    contents: {
        position:'absolute',
        top:0, 
        right:0,
        bottom:0,
        left:0
    }
})

const QuadBasket = props => {

    let { classes } = props
    return (
        <div id="quadbasket" 
            className = {classes.quadbasket}
        >
            <div className = {classes.transfermoniker}>
                TRANSFER BIN
            </div>
            <div className = {classes.contents}>
                {props.children}
            </div>
        </div>    
    )
}

export default withStyles(styles)(QuadBasket)
