// quadviewport.view.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later
'use strict'

import React from 'react'

import { withStyles, createStyles } from '@material-ui/core/styles'

const styles = createStyles({
    root:{
        position:'absolute',
        top:'48px',
        left:'0',
        right:'0',
        bottom:'0',
        backgroundColor:'tan',
        overflow:'hidden',
    }
})

const QuadViewport = props => {
    let { classes } = props
    return (
        <div id="quadviewport" 
            className = { classes.root }                
        >
            { props.children }
        </div>
    )
}

export default withStyles(styles)(QuadViewport)
