// quaddatapane.view.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

import { withStyles, createStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import dataPane from './datapane/dataPane'

const styles = createStyles({
    root:{
        position:'absolute',
        top:'15px',
        right:'6px',
        bottom:'6px',
        left:'6px',
        overflow:'auto',
    },
    content:{
        padding:'3px',
    }
})

class DataPane extends React.Component<any,any>  {

    render() {

        const { classes, dataPaneMessage } = this.props

        let msg = dataPaneMessage || {}
        let { docpack, options } = msg

        return <Paper className = {classes.root}>
            <div className = { classes.content }>
                Data shelf {options?options.opcode:null}
            </div>
        </Paper>

    }

}

export default withStyles(styles)( DataPane )
