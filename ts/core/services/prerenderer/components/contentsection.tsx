// contentsection.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'
// import DialogTitle from '@material-ui/core/DialogTitle'
// import Button from '@material-ui/core/Button'
import {withStyles, createStyles} from '@material-ui/core/styles'

const styles = theme => (createStyles({
  root: {
        border:'2px solid silver',
        padding:'3px',
        marginBottom:'8px',
    },
}))

const ContentSection = props => {

    let classes = props.classes

    return <div className = {classes.root}>

        {props.children}

    </div>

}

export default withStyles(styles)(ContentSection)