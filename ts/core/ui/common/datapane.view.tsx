// quaddatapane.view.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

/*
    do a deep merge of account settings when the are edited to 
    protect them against asyn updates from database.
    do a deep-diff when new account version is updated to alert user as to changes

*/

'use strict'

import React from 'react'

import { withStyles, createStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import dataPane from './datapane/dataPane' // object
import Renderer from '../../services/renderer' // class
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
        this.renderContent = this.getRenderContent()
    }

    state = {
        docpack:null,
        typepack:null,
        options:this.props.dataPaneMessage?this.props.dataPaneMessage.options:null,
    }

    docProxy
    renderContent

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

    getRenderContent = () => {
        let options = this.state.options
        let { classes } = this.props
        return <div className = { classes.content }>
                Data shelf {options?options.opcode:null}
            </div>

    }

    render() {

        const { classes, dataPaneMessage } = this.props

        let msg = dataPaneMessage || {}
        let { docpack, options } = msg

        return <Paper className = {classes.root}>
            {this.renderContent}
        </Paper>

    }

}

export default withStyles(styles)( DataPane )
