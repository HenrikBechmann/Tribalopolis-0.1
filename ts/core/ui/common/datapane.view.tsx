// quaddatapane.view.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

/*
    do a deep merge of account settings when they are edited to 
    protect them against async updates from database.
    do a deep-diff when new account version is updated to alert user as to changes

*/

'use strict'

import React from 'react'

import { withStyles, createStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import PreRenderer from '../../services/prerenderer' // class
import { 
    SetListenerMessage,
    ReturnDocPairMessage,
    PreRenderMessage,
    ContainerData,
 } from '../../services/interfaces'
import application from '../../services/application'
import docproxy from '../../utilities/docproxy'
import utilities from '../../utilities/utilities'

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
        this.callbacks = this.props.dataPaneMessage?this.props.dataPaneMessage.callbacks:null

        // console.log('callbacks in DataPane constructur',this.callbacks,props)
    }

    state = {
        docpack:null,
        typepack:null,
        options:this.props.dataPaneMessage?this.props.dataPaneMessage.options:null,
    }

    docProxy
    prePreRenderMessage:PreRenderMessage
    renderContent // set when docPair arrives
    userdata
    callbacks

    componentDidMount() {

        this.assertListener()
        this.userdata = application.userdata
        // console.log('DataPane view did mount - userdata',this.userdata)

    }

    componentDidUpdate() {
        // console.log('componentDidUpdate',this.props)
        let { dataPaneMessage } = this.props
        if (!this.docProxy && dataPaneMessage && dataPaneMessage.docproxy) {
            this.docProxy = dataPaneMessage.docproxy
            // console.log('componentDidUpdate setting this.docProxy',this.docProxy)
            this.assertListener()
        }
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

    prerenderer = null

    cacheDocPair = ({docpack, typepack, reason}:ReturnDocPairMessage) => {

        // database type data namespace
        let containerdata:ContainerData = {
            userdata:this.userdata,
            props:this.props,
            callbacks:this.callbacks,
        }

        // console.log('containerdata and this.callbacks',containerdata,this.callbacks)

        if ( !this.prerenderer ) {
            this.prerenderer = new PreRenderer()
        }

        // reformat for prerenderer
        this.prePreRenderMessage = 
            this.prerenderer.getPreRenderMessage(
                docpack,
                typepack,
                this.state.options,
                containerdata
            )

        this.prerenderer.setPreRenderMessage(this.prePreRenderMessage)
        this.renderContent = this.prerenderer.getRenderContent()

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
            {this.renderContent?this.renderContent:<div>Loading...</div>}
        </Paper>

    }

}

export default withStyles(styles)( DataPane )
