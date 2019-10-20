// quaddatapane.view.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

/*
    do a deep merge of account settings when they are edited to 
    protect them against async updates from database.
    do a deep-diff when new account version is updated to alert user as to changes

*/

'use strict'

import React from 'react'

import { toast } from 'react-toastify'

import { withStyles, createStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import ComponentFactory from '../../services/componentfactory' // class
import { 
    SetListenerMessage,
    DocpackPairPayloadMessage,
    FactoryMessage,
    FactoryNamespace,
    ControllerData,
    AgentData,
    GenericObject,
    DataPaneMessage,
 } from '../../services/interfaces'
import application from '../../services/application'
import docproxy from '../../utilities/docproxy'

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

interface DataPaneProps {
    dataPaneMessage:DataPaneMessage,
    classes:GenericObject, // provided by withStyles in export statement
    dataName:string,
    ref?:any,
    locked?:boolean,
    active:boolean,
}

class DataPane extends React.Component<DataPaneProps,any>  {

    state = {
        factorycomponent:null,
    }

    componentfactory:ComponentFactory = new ComponentFactory()

    docProxy // used to control document fetches

    childformsEditingstatus = {}

    componentDidMount() {

        this.assertTargetListener()

    }

    componentDidUpdate(prevProps) {
        // console.log('datapane componentDidUpdate', prevProps.active, this.props.active)
        if (prevProps.active && !this.props.active) {
            this.reset()
        }
        this.assertTargetListener()

    }

    componentWillUnmount() {
        // console.log('datapane componentWillUnmount')
        this.removeListeners()
    
    }

    removeListeners = () => {

        if (!this.docProxy) return

        application.removeDocpackPairListener(
            {
                doctoken:this.docProxy.doctoken,
                instanceid:this.docProxy.instanceid,
            }
        )
    }

    reset = () => {
        // console.log('resetting datapane')
        this.removeListeners()
        this.docProxy = undefined
        this.childformsEditingstatus = {}
        this.setState({
            factorycomponent:null,
        })
    }

   // registerGetEditingState = ({getEditingState, instanceid}) => {
   //     console.log('registerGetEditingState',instanceid)
   //     this.childformsEditingstatus[instanceid] = getEditingState
   // }

    assertTargetListener = () => {

        let { dataPaneMessage } = this.props
        if (!this.docProxy && dataPaneMessage && dataPaneMessage.docproxy) {

            this.docProxy = dataPaneMessage.docproxy

            this.assertListener()

        }

    }

    assertListener = () => {

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

    registerCalldowns = (calldowns) => {
        this.calldowns[calldowns.instanceid] = calldowns
        console.log('calldowns in datapane',calldowns, this.calldowns)
    }

    calldowns:GenericObject = {}

    monitorEditState = (instanceid, isediting) => {
        this.editstates[instanceid] = isediting
        console.log('monitorEditState editstates',this.editstates)
    }

    editstates:GenericObject = {}

    // obtain a ComponentFactory component
    successAssertListener = (parmblock:DocpackPairPayloadMessage) => {

        let { docpack, typepack, reason } = parmblock

        let { callbacks, docproxy, registerCalldowns, options } = this.props.dataPaneMessage

        let controllerdata:ControllerData = {

            userdata:application.userdata,
            systemdata:application.systemdata,
            callbacks,
            // registerCalldowns,
        }

        let agentcallbacks = {
            monitorEditState:this.monitorEditState
        }

        let agentdata:AgentData = {
            callbacks:agentcallbacks,
            registerCalldowns:this.registerCalldowns,
            locked:this.props.locked,
        }

        // reformat for componentfactory
        let namespace:FactoryNamespace = {

            docproxy,
            options,
            docpack,
            typepack,
            controller:controllerdata,
            agent:agentdata,

        }

        /* 
            returns { renderdata, namespace }
            where namespace = as above
        */
        let factorymessage:FactoryMessage = 
            this.componentfactory.assembleFactoryMessage(namespace)

        let factorycomponent = this.componentfactory.createUISelection(factorymessage)
        // console.log('factorycomponent', factorycomponent)

        this.setState({

            factorycomponent,

        })

    }

    failureAssertListener = (error, reason) => {

        toast.error('Unable to retrieve data')
        console.log('failureAssertListener in datapane.view',error,reason)

    }

    getEditingState = () => {
        // console.log('datapane:getEditingState')
        let editingstate = false
        let { childformsEditingstatus } = this
        for (let index in childformsEditingstatus) {
            editingstate = !!childformsEditingstatus[index]()
            if ( editingstate ) break
        }
        return editingstate
    }

    render() {

        const { classes } = this.props

        return <Paper className = {classes.root}>

            {this.state.factorycomponent?this.state.factorycomponent:<div>Waiting...</div>}

        </Paper>

    }

}

export default withStyles(styles)( DataPane )
