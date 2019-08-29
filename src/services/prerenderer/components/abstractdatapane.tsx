// abstractdatapane.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

import PreRenderer from '../../prerenderer'
import Proxy from '../../../utilities/docproxy'
import application from '../../../services/application'
import { 
    SetListenerMessage, 
    RemoveListenerMessage, 
    DocpackPairPayloadMessage, 
    PreRenderContext 
} from '../../../services/interfaces'

class AbstractDataPane extends React.Component<any,any> {

    constructor(props) {

        super(props)

        this.prerenderer = new PreRenderer()

        let { reference, options, namespace, attributes} = this.props

        this.reference = reference
        this.options = options
        // this.namespace = namespace
        this.userdata = namespace.container.userdata
        this.callbacks = namespace.container.callbacks
        this.reference && (this.docProxy = new Proxy({doctoken:{reference}}))
        this.attributes = attributes

    }

    state = {
        // options:null,
        docpack:null,
        typepack:null,
    }

    prerenderer:PreRenderer = null
    reference
    attributes
    options
    // namespace
    docProxy:Proxy
    userdata
    callbacks
    // preRenderContext:PreRenderContext
    renderContent

    componentDidMount() {
        // subscribe to reference
        this.assertListener()
        
    }

    componentWillUnmount() {

        if (this.docProxy) {
            let msg:RemoveListenerMessage = 
            {
                doctoken:this.docProxy.doctoken,
                instanceid:this.docProxy.instanceid,
            }
            application.removeDocpackPairListener(msg)
        }

    }

    assertListener = () => {
        // console.log('assertListener in abstractdatapane',this.props,this.docProxy)
        if (this.docProxy) {

            let parms:SetListenerMessage = 
                {
                    doctoken:this.docProxy.doctoken,
                    instanceid:this.docProxy.instanceid,
                    success:this.successAssertListener,
                    failure:this.failureAssertListener,
                }

            application.setDocpackPairListener( parms )

        } else {
            let { attributes } = this
            let { assertinstance, typereference, collection, customid } = attributes
            if (assertinstance && typereference && collection) {
                let parms = {
                    typereference,
                    collection,
                    customid:customid || null,
                    success:this.successAssertListener,
                    failure:this.failureAssertListener,
                }
                this.docProxy = application.setNewDocpackPairListener( parms )
            } else {

                console.log('unable to create content props',this.props)
                this.renderContent = <div>unable to create content</div>
                this.forceUpdate()

            }

        }
    }

    successAssertListener = (parmblock:DocpackPairPayloadMessage) => {

        let {docpack, typepack, reason} = parmblock
        // console.log('abstractdatapane cacheDocPair', parmblock)
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
        let preRenderContext:PreRenderContext = 
            this.prerenderer.assemblePreRenderContext({
                docpack,
                typepack,
                options:this.options,
                container:containerdata,
            })

        // this.prerenderer.setPreRenderMessage(this.preRenderContext)
        this.renderContent = this.prerenderer.getRenderContent(preRenderContext)

        this.setState({
            docpack,
            typepack,
        })

    }

    failureAssertListener = (error,reason) => {
        console.log('abstractdatapane failureAssertListener',error,reason)
    }

    render() {

        return this.renderContent || null
        
   }

}

export default AbstractDataPane
