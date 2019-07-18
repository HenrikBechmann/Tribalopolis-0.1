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
    PreRenderContext,
    GetPreRenderContext,
    ContainerData,
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
    1. Takes dataPaneContext consisting of 
        docProxy, (target)
        options, (options.uiselection for target)
        callbacks

    2.  uses that to obtain docpack and typepack (document and reference for each)

    3. then uses that to bundle 
        container data (userdata, props, callbacks)
        dockpack
        typepack
        options

        for the prerenderer

    4. The prerenderer remaps to

        container
        props
        document
        type

    which becomes the namespace for the rendering

    5. The prerenderer returns content (elements) 

    6. content is rendered by DataPane (wrapped in Paper)
*/

class DataPane extends React.Component<any,any>  {

    constructor(props) {
        super(props)
        this.docProxy = this.props.dataPaneContext?this.props.dataPaneContext.docProxy:null
        this.callbacks = this.props.dataPaneContext?this.props.dataPaneContext.callbacks:null

    }

    state = {
        docpack:null,
        typepack:null,
        options:this.props.dataPaneContext?this.props.dataPaneContext.options:null,
    }

    docProxy
    // preRenderContext:PreRenderContext
    renderContent // set when docPair arrives
    userdata
    callbacks

    componentDidMount() {

        // this.assertListener()
        this.userdata = application.userdata

        let { dataPaneContext } = this.props
        if (!this.docProxy && dataPaneContext && dataPaneContext.docproxy) {
            this.docProxy = dataPaneContext.docproxy
            // console.log('componentDidUpdate setting this.docProxy',this.docProxy)
            this.assertListener()
        }

    }

    componentDidUpdate() {

        let { dataPaneContext } = this.props
        if (!this.docProxy && dataPaneContext && dataPaneContext.docproxy) {
            this.docProxy = dataPaneContext.docproxy
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

    prerenderer:PreRenderer = null

    cacheDocPair = ({docpack, typepack, reason}:ReturnDocPairMessage) => {

        // database type data namespace
        let containerdata:ContainerData = {
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
            container:containerdata
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

    componentWillUnmount() {
        if (!this.docProxy) return

        application.removeDocpackPairListener({doctoken:this.docProxy.doctoken,
                    instanceid:this.docProxy.instanceid,})
    
    }

    render() {

        const { classes, dataPaneContext } = this.props

        let msg = dataPaneContext || {}
        let { docpack, options } = msg

        return <Paper className = {classes.root}>
            {this.renderContent?this.renderContent:<div>Loading...</div>}
        </Paper>

    }

}

export default withStyles(styles)( DataPane )
