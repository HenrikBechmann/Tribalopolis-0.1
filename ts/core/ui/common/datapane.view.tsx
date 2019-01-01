// quaddatapane.view.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

import { withStyles, createStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import dataPane from './datapane/dataPane'
import { 
    SetListenerMessage,
    ReturnDocPairMessage,
 } from '../../services/interfaces'
import application from '../../services/application'
import docproxy from '../../utilities/docproxy'

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

    constructor(props) {
        super(props)
        this.docProxy = this.props.dataPaneMessage?this.props.dataPaneMessage.docProxy:null
    }

    state: {
        docpack:null,
        typepack:null,
    }

    docProxy

    componentDidMount() {

        this.assertListener()

    }

    assertListener = () => {

        if (this.docProxy) {
            let parms:SetListenerMessage = 
                {
                    doctoken:this.docProxy.doctoken,
                    instanceid:this.docProxy.instanceid,
                    success:this.cacheDocPair,
                    failure:null,
                }
            application.setDocpackPairListener( parms )
        }
    }

    cacheDocPair = ({docpack, typepack, reason}:ReturnDocPairMessage) => {

        this.setState({
            docpack,
            typepack,
        })

    }

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
