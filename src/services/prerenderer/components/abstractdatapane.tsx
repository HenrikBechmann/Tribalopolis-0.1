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
    DocpackPairPayloadMessage,, 
    PreRenderContext,
    PostDocument
} from '../../../services/interfaces'

import utlities from '../../../utilities/utilities'

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

    private assertListener = () => {
        // console.log('assertListener in abstractdatapane:this.props,this.docProxy',this.props,this.docProxy)
        if (this.docProxy) {
            let parms:SetListenerMessage = 
                {
                    doctoken:this.docProxy.doctoken,
                    instanceid:this.docProxy.instanceid,
                    success:this.successAssertListener,
                    failure:this.failureAssertListener,
                }
            console.log('assertListener with docProxy: docProxy, parms',this.docProxy,parms)
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
                // console.log('assertListener no docProxy: attributes, parms',attributes, parms)
                this.docProxy = application.setNewDocpackPairListener( parms )
            } else {

                console.log('unable to create content props',this.props)
                this.renderContent = <div>unable to create content</div>
                this.forceUpdate()

            }

        }
    }

    private successAssertListener = (parmblock:DocpackPairPayloadMessage) => {

        // console.log('abstractdatapane successAssertListener: parmblock',parmblock)
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

    private failureAssertListener = (error,reason) => {
        console.log('abstractdatapane failureAssertListener',error,reason)
    }

    // to be used with basic datapane forms
    defaultOnSubmit = ( {formcontext, success, failure}:PostDocument ) => {

        let { documentcontext, statecontext, documentmap } = formcontext
        // let document = merge({},this.documentcontext.document)
        let { document, type } = documentcontext

        for (let valueindex in statecontext.values) {
            // console.log('valueindex, documentmap, state.values',valueindex,this.documentmap, this.state.values)
            let path = documentmap[valueindex].split('.')
            // console.log('document, path',document, path)
            let nodespecs = utlities.getNodePosition(document,path)
            let value = statecontext.values[valueindex]
            let datatype
            if (value === undefined) value = null;
            [value,datatype] = application.filterDataOutgoingValue(value, path, type)
            nodespecs.nodeproperty[nodespecs.nodeindex] = value
        } 

        let message = {
            document,
            reference:documentcontext.props.reference,
            success,
            failure,
        }

        application.setDocument(message)
        statecontext.setState({
            dirty:false
        })

    }


    render() {

        return this.renderContent || null
        
   }

}

export default AbstractDataPane
