// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
// main.controller.tsx

/*
    bootstrap:
    1. index.html
    2. index.tsx
    3. main.controller
    4. main.view
    5. approuter
    6. routes
*/

'use strict'

import React from 'react'

// TODO: temporary -- replace with application service
import coredata from  '../../data/coredata'

let fontFamily = coredata.theme.typography.fontFamily

import { DragDropContext } from 'react-dnd'
// import DnDHTMLBackend from 'react-dnd-html5-backend'
import DnDTouchBackend from 'react-dnd-touch-backend'

import DnDHtml5Backend from 'react-dnd-html5-backend'

import DnDManager from 'react-dnd'

import application from '../services/application'

let isMobile = application.properties.ismobile

let DnDBackend = isMobile?DnDTouchBackend:DnDHtml5Backend

import MainView from './main.view'

import authapi from '../services/auth.api'
import UserContext from '../services/user.context'

import { toast } from 'react-toastify'

import { withStyles, createStyles } from '@material-ui/core/styles'

let styles = createStyles({
    mainviewstyle: {
        fontFamily:fontFamily,
    }
})


@DragDropContext(DnDBackend)
class Main extends React.Component<any,any> {

    constructor(props) {
        super(props)
        authapi.setUpdateCallback(this.getUserCallback)
    }

    state = {
        user:null,
        userProviderData:null,
    }

    getUserCallback = (user) => {
        if (user) {
            toast.success(`signed in as ${user.displayName}`,{autoClose:2500})
        }
        let userProviderData = user?user.providerData[0]:null
        this.setState({
            user,
            userProviderData,
        })
    }

    render() {
        let { globalmessage, version, classes } = this.props

        return (
            <UserContext.Provider value = {this.state.userProviderData}>
                <MainView globalmessage={globalmessage}
                    className = {classes.mainviewstyle} 
                />
            </UserContext.Provider>
        )
    }
}

export default withStyles(styles)(Main)
