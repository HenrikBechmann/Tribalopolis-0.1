// abstractdatapane.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

import ComponentFactory from '../../componentfactory'
import Proxy from '../../../utilities/docproxy'
import application from '../../../services/application'
import { 
    SetListenerMessage, 
    RemoveListenerMessage, 
    DocpackPairPayloadMessage,
    FactoryMessage,
    PostFormMessage,
    GenericObject,
} from '../../../services/interfaces'

interface AbstractDataPaneProps {
    reference:string,
    options: GenericObject,
    namespace: GenericObject,
    attributes: GenericObject,
}

class AbstractDataPane extends React.Component<AbstractDataPaneProps,any> {

    constructor(props) {

        super(props)

        this.componentfactory = new ComponentFactory()

        let { reference, options, namespace, attributes} = this.props

        this.reference = reference
        this.options = options
        // this.namespace = namespace
        this.userdata = namespace.controller.userdata
        this.callbacks = namespace.controller.callbacks
        this.reference && (this.docProxy = new Proxy({doctoken:{reference}}))
        this.attributes = attributes

    }

    state = {
        // options:null,
        docpack:null,
        typepack:null,
    }

    componentfactory:ComponentFactory = null
    reference
    attributes
    options
    // namespace
    docProxy:Proxy
    userdata
    callbacks
    // preRenderMessage:PreRenderMessage
    factorycomponent

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
                this.factorycomponent = <div>unable to create content</div>
                this.forceUpdate()

            }

        }
    }

    private successAssertListener = (parmblock:DocpackPairPayloadMessage) => {

        // console.log('abstractdatapane successAssertListener: parmblock',parmblock)
        let {docpack, typepack, reason} = parmblock
        // console.log('abstractdatapane cacheDocPair', parmblock)
        // database type data namespace
        let controllerdata = {
            userdata:this.userdata,
            props:this.props,
            callbacks:this.callbacks,
        }

        // console.log('containerdata and this.callbacks',containerdata,this.callbacks)

        if ( !this.componentfactory ) {
            this.componentfactory = new ComponentFactory()
        }

        // reformat for componentfactory
        let preRenderMessage:FactoryMessage = 
            this.componentfactory.assembleFactoryMessage({
                docpack,
                typepack,
                options:this.options,
                controller:controllerdata,
            })

        // this.componentfactory.setPreRenderMessage(this.preRenderMessage)
        this.factorycomponent = this.componentfactory.getComponent(preRenderMessage)

        this.setState({
            docpack,
            typepack,
        })

    }

    private failureAssertListener = (error,reason) => {
        console.log('abstractdatapane failureAssertListener',error,reason)
    }

    render() {

        return this.factorycomponent || null
        
   }

}

export default AbstractDataPane
