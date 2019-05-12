// loadingmessage.view.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later
'use strict'

import React from 'react'

import { withStyles, createStyles } from '@material-ui/core/styles'

let styles = createStyles({
    root:{
        padding:'3px',
        opacity:.54,
        fontStyle:'italic',
    }
})


const LoadingMessage = props => {
    return <div className = {props.classes.root}>
        <span>Loading...</span> 
    </div>
}

export default withStyles(styles)(LoadingMessage)