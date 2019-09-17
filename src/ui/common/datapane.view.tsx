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
import ComponentFactory from '../../services/componentfactory' // class
import { 
    SetListenerMessage,
    DocpackPairPayloadMessage,
    FactoryMessage,
    GetFactoryMessage,
    ControllerData,
 } from '../../services/interfaces'
import application from '../../services/application'
import docproxy from '../../utilities/docproxy'
import { DataPaneMessage, GenericObject } from '../../services/interfaces'

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

        for the componentfactory

    4. The componentfactory remaps to

        controller
        props
        document
        type

    which becomes the namespace for the rendering

    5. The componentfactory returns content (elements) 

    6. content is rendered by DataPane (wrapped in Paper)
*/

interface DataPaneProps {
    dataPaneMessage:DataPaneMessage,
    classes:GenericObject, // provided by withStyles in export statement
}

class DataPane extends React.Component<DataPaneProps,any>  {

    state = {
        factorycomponent:null,
    }

    componentfactory:ComponentFactory = new ComponentFactory()

    // dataPaneMessage properties
    docProxy

    componentDidMount() {

        this.assertTargetListener()

    }

    componentDidUpdate() {

        this.assertTargetListener()

    }

    componentWillUnmount() {
        if (!this.docProxy) return

        application.removeDocpackPairListener({doctoken:this.docProxy.doctoken,
                    instanceid:this.docProxy.instanceid,})
    
    }

    assertTargetListener = () => {

        let { dataPaneMessage } = this.props
        if (!this.docProxy && dataPaneMessage.docproxy) {

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

    // obtain a ComponentFactory component
    successAssertListener = (parmblock:DocpackPairPayloadMessage) => {

        let { docpack, typepack, reason } = parmblock
        // database type data namespace
        let controllerdata:ControllerData = {

            userdata:application.userdata,
            callbacks:this.props.dataPaneMessage.callbacks,

        }

        // reformat for componentfactory
        let sourcemessage:GetFactoryMessage = {

            docpack,
            typepack,
            options:this.props.dataPaneMessage.options,
            controller:controllerdata

        }

        let factorymessage:FactoryMessage = 
            this.componentfactory.assembleFactoryMessage(sourcemessage)

        let factorycomponent = this.componentfactory.getComponent(factorymessage)

        this.setState({

            factorycomponent,

        })

    }

    failureAssertListener = (error, reason) => {

        console.log('failureAssertListener in datapane.view',error,reason)

    }

    render() {

        const { classes } = this.props

        return <Paper className = {classes.root}>

            {this.state.factorycomponent?this.state.factorycomponent:<div>Loading...</div>}

        </Paper>

    }

}

export default withStyles(styles)( DataPane )
