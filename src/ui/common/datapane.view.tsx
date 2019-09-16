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
    DocpackPairPayloadMessage,
    PreRenderContext,
    GetPreRenderContext,
    ControllerData,
 } from '../../services/interfaces'
import application from '../../services/application'
import docproxy from '../../utilities/docproxy'
import utilities from '../../utilities/utilities'

const styles = createStyles({
    root:{
        position:'absolute',
        top:'6px',
        right:'6px',
        bottom:'6px',
        left:'6px',
        overflow:'auto',
    },
    content:{
        padding:'3px',
    }
})

/*
    1. Takes dataPaneMessage consisting of 
        docProxy, (target)
        options, (options.uiselection for target)
        callbacks,
        calldowns,
        namespace,

    2.  uses that to obtain docpack and typepack (document and reference for each)

    3. then uses that to bundle 
        controller data (userdata, props, callbacks)
        dockpack
        typepack
        options

        for the prerenderer

    4. The prerenderer remaps to

        controller
        props
        document
        type

    which becomes the namespace for the rendering

    5. The prerenderer returns content (elements) 

    6. content is rendered by DataPane (wrapped in Paper)
*/

class DataPane extends React.Component<any,any>  {

    // constructor(props) {
    //     super(props)
        // let { dataPaneMessage } = this.props
        // if (!dataPaneMessage) dataPaneMessage = {}
        // let { docproxy:docProxy, options, callbacks, calldowns, namespace } = dataPaneMessage
        // this.docProxy = docProxy
        // this.options = options
        // this.callbacks = callbacks
        // this.calldowns = calldowns
        // this.namespace = namespace
    // }

    state = {
        docpack:null,
        typepack:null,
        options:this.props.dataPaneMessage?this.props.dataPaneMessage.options:null,
    }

    // dataPaneMessage properties
    docProxy
    callbacks = this.props.dataPaneMessage?this.props.dataPaneMessage.callbacks:null
    // options
    // calldowns
    // namespace
    // preRenderContext:PreRenderContext
    renderContent // set when docPair arrives
    userdata

    componentDidMount() {

        // this.assertListener()
        this.userdata = application.userdata

        this.assertTargetListener()

    }

    componentDidUpdate() {

        this.assertTargetListener()

    }

    assertTargetListener = () => {

        let { dataPaneMessage } = this.props
        if (!this.docProxy && dataPaneMessage && dataPaneMessage.docproxy) {
            this.docProxy = dataPaneMessage.docproxy
            // console.log('componentDidUpdate setting this.docProxy',this.docProxy)
            this.assertListener()
        }

    }

    assertListener = () => {

        // console.log('assertListener in datapane.view', this.docProxy)
        if (this.docProxy) {
            let parms:SetListenerMessage = 
                {
                    doctoken:this.docProxy.doctoken,
                    instanceid:this.docProxy.instanceid,
                    success:this.successAssertListener,
                    failure:this.failureAssertListener,
                }

            application.setDocpackPairListener( parms )
        }
    }

    prerenderer:PreRenderer = null

    successAssertListener = (parmblock:DocpackPairPayloadMessage) => {

        let {docpack, typepack, reason} = parmblock
        // database type data namespace
        let controllerdata:ControllerData = {
            userdata:this.userdata,
            props:this.props,
            callbacks:this.callbacks,
        }

        if ( !this.prerenderer ) {
            this.prerenderer = new PreRenderer()
        }

        // reformat for prerenderer
        let sourcecontext:GetPreRenderContext = {
            docpack,
            typepack,
            options:this.state.options,
            controller:controllerdata
        }
        let preRenderContext:PreRenderContext = 
            this.prerenderer.assemblePreRenderContext(sourcecontext)

        // this.prerenderer.setPreRenderMessage(this.preRenderContext)
        this.renderContent = this.prerenderer.getRenderContent(preRenderContext)
        // console.log('renderContent',this.renderContent)

        this.setState({
            docpack,
            typepack,
        })

    }

    failureAssertListener = (error, reason) => {
        console.log('failureAssertListener in datapane.view',error,reason)
    }

    componentWillUnmount() {
        if (!this.docProxy) return

        application.removeDocpackPairListener({doctoken:this.docProxy.doctoken,
                    instanceid:this.docProxy.instanceid,})
    
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
