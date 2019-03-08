// abstractdatapane.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

import PreRenderer from '../../prerenderer'
import Proxy from '../../../utilities/docproxy'
import application from '../../../services/application'
import { SetListenerMessage, RemoveListenerMessage, ReturnDocPairMessage } from '../../../services/interfaces'

class AbstractDataPane extends React.Component<any,any> {

    constructor(props) {

        super(props)

        this.prerenderer = new PreRenderer()

        let { reference, options, data } = this.props

        console.log('reference, options, data in abstractdatapane',reference, options, data)
        this.reference = reference
        this.options = options
        this.data = data
        this.userdata = data.container.userdata
        this.callbacks = data.container.callbacks
        this.docProxy = new Proxy({doctoken:{reference}})

    }

    state = {
        // options:null,
        docpack:null,
        typepack:null,
    }

    prerenderer = null
    reference
    options
    data
    docProxy:Proxy
    userdata
    callbacks
    preRenderMessage
    renderContent

    componentDidMount() {
        // subscribe to reference
        this.assertListener()
        
    }

    componentWillUnmount() {

        let msg:RemoveListenerMessage = 
        {
            doctoken:this.docProxy.doctoken,
            instanceid:this.docProxy.instanceid,
        }
        application.removeDocpackPairListener(msg)

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

        console.log('abstractdatapane cacheDocPair', docpack, typepack)

        // database type data namespace
        let containerdata = {
            userdata:this.userdata,
            props:this.props,
            callbacks:this.callbacks,
        }

        // console.log('containerdata and this.callbacks',containerdata,this.callbacks)

        if ( !this.prerenderer ) {
            this.prerenderer = new PreRenderer()
        }

        // reformat for prerenderer
        this.preRenderMessage = 
            this.prerenderer.getPreRenderMessage({
                docpack,
                typepack,
                options:this.options,
                container:containerdata,
            })

        this.prerenderer.setPreRenderMessage(this.preRenderMessage)
        this.renderContent = this.prerenderer.getRenderContent()
        console.log('renderContent;from',this.renderContent,this.preRenderMessage)

        this.setState({
            docpack,
            typepack,
        })

    }

    render() {

        return this.renderContent || null
        
   }

}

export default AbstractDataPane

// if ( !this.prerenderer ) {
//     this.prerenderer = new PreRenderer()
// }

// // reformat for prerenderer
// this.prePreRenderMessage = 
//     this.prerenderer.getPreRenderMessage(
//         docpack,
//         typepack,
//         this.state.options,
//         containerdata
//     )

// this.prerenderer.updatePreRenderMessage(this.prePreRenderMessage)
// this.renderContent = this.prerenderer.assemble()
