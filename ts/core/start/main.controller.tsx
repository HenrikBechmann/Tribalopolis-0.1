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

let DnDBackend = DnDTouchBackend({ enableMouseEvents: true })

import MainView from './main.view'

import authapi from '../services/auth.api'
import UserContext from '../services/user.context'

import { toast } from 'react-toastify'

class Main extends React.Component<any,any> {

    constructor(props) {
        super(props)
        authapi.setUpdateCallback(this.getUserCallback)
    }

    state = {
        user:null,
        userProviderData:null,
    }

    mainviewstyle:React.CSSProperties = {
        fontFamily,
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
        let { globalmessage, version } = this.props

        return (
            <UserContext.Provider value = {this.state.userProviderData}>
                <MainView globalmessage={globalmessage}
                    style = {this.mainviewstyle} 
                />
            </UserContext.Provider>
        )
    }
}

export default DragDropContext(DnDBackend)(Main)
