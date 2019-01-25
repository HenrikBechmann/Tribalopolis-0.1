// abstractdatapane.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

import PreRenderer from '../../prerenderer'
import Proxy from '../../../utilities/docproxy'
import application from '../../../services/application'
import { SetListenerMessage, ReturnDocPairMessage } from '../../../services/interfaces'

class AbstractDataPane extends React.Component<any,any> {

    constructor(props) {

        super(props)

        this.prerenderer = new PreRenderer()

        let { reference, options, data } = this.props

        console.log('reference, options, data in abstractdatapand',reference, options, data)
        this.reference = reference
        this.options = options
        this.data = data
        this.userdata = data.container.userdata
        this.callbacks = data.container.callbacks
        this.docProxy = new Proxy({doctoken:{reference}})

    }

    prerenderer = null
    reference
    options
    data
    docProxy
    userdata
    callbacks
    renderMessage
    renderContent

    componentDidMount() {
        // subscribe to reference
        
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
        this.renderMessage = 
            this.prerenderer.getRenderMessage(
                docpack,
                typepack,
                this.state.options,
                containerdata
            )

        this.prerenderer.updateRenderMessage(this.renderMessage)
        this.renderContent = this.prerenderer.assemble()

        this.setState({
            docpack,
            typepack,
        })

    }

    render() {

        return <div>
        
            {this.props.children}
        
        </div>

   }

}

export default AbstractDataPane

// if ( !this.prerenderer ) {
//     this.prerenderer = new PreRenderer()
// }

// // reformat for prerenderer
// this.renderMessage = 
//     this.prerenderer.getRenderMessage(
//         docpack,
//         typepack,
//         this.state.options,
//         containerdata
//     )

// this.prerenderer.updateRenderMessage(this.renderMessage)
// this.renderContent = this.prerenderer.assemble()
