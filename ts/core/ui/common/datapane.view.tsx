// quaddatapane.view.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

import { withStyles, createStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'

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

class QuadDataPane extends React.Component<any,any>  {

    render() {
        const { classes, dataPaneMessage } = this.props
        // console.log('props',this.props)
        return <Paper className = {classes.root}>
            <div className = { classes.content }>
                Data shelf {dataPaneMessage?dataPaneMessage.options.opcode:null}
            </div>
        </Paper>
    }

}

export default withStyles(styles)( QuadDataPane )
