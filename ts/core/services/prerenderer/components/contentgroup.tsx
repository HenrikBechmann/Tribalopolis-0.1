// contentgroup.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React, {useState} from 'react'

import {withStyles, createStyles} from '@material-ui/core/styles'
import Icon from '@material-ui/core/Icon'

const styles = theme => (createStyles({
  root: {
        marginBottom:'8px',
    },
  title: {
        fontSize:'larger',
        fontWeight:'bold',
        whiteSpace: 'nowrap', 
        overflow: 'hidden',
        textOverflow: 'ellipsis'
     }
}))

const ContentGroup = props => {
    let [open, setOpen] = React.useState(false)
    let { classes, title }  = props

    return <div className = {classes.root}>

        <div className = {classes.title}
            onClick = {
                () => {setOpen(!open)}
            }
        >
            <Icon style = {{transform: open?'none':'rotate(90deg'}} >arrow_right</Icon> {title}
        </div>
        <div style = {{display:open?'block':'none',}}>
            {props.children}
        </div>

    </div>

}

export default withStyles(styles)(ContentGroup)