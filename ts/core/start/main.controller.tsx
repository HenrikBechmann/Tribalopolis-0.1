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

/*
    TODO:
    - collect fetch of login, user, and account together with promise collection 
        so as to render only once for those
    - accomodate need to asynchronously update account and user data from other sources
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
import UserDataContext from '../services/userdata.context'
import SystemDataContext from '../services/systemdata.context'

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
        this.getSystemData()
        authapi.setUpdateCallback(this.getUserCallback)
    }

    state = {
        login:null,
        userProviderData:null,
        system:null,
        user:null,
        account:null,
    }

    getSystemData = () => {
        application.getDocument('/system/parameters',this.getSystemDataCallback,this.getSystemDataError)
    }

    getSystemDataCallback = data => {
        toast.info('setting system data')
        this.setState({
            system:data,
        })
    }

    getSystemDataError = error => {
        toast.error('Unable to get system data')
    }

    getUserCallback = (login) => {
        let userProviderData = null
        if (login) {
            toast.success(`signed in as ${login.displayName}`,{autoClose:2500})
            userProviderData = login.providerData[0] // only google for now
            // console.log('user provider data',userProviderData)
        }
        this.setState({
            login,
            userProviderData,
        }, () => {
                this.getUserDocument(userProviderData.uid)
            }
        )
    }

    getUserDocument = uid => {
        application.queryCollection('users',[['identity.loginid.uid','==',uid]],this.userDocumentSuccess, this.userDocumentFailure)
    }

    userDocumentSuccess = doclist => {
        console.log('doclist from userdoc',doclist)
        if (!doclist.length) return
        if (doclist.length > 1) {
            toast.error('duplicate user id')
            return
        }
        toast.info('setting user record')
        this.setState({
            user:doclist[0]
        },() => {
            this.getAccountDocument(this.state.user.data.identity.account)
        })
    }

    userDocumentFailure = error => {
        toast.error(error)
    }

    getAccountDocument = reference => {
        application.getDocument(reference,this.userAccountSuccess, this.userAccountFailure)
    }

    userAccountSuccess = document => {
        if (!document) return
        toast.info('setting account record')
        this.setState({
            account:document,
        })
    }

    userAccountFailure = error => {
        toast.error(error)
    }

    render() {
        let { globalmessage, version, classes } = this.props

        let userdata = {
            login:this.state.userProviderData,
            user:this.state.user,
            account:this.state.account,
        }

        console.log('userdata',userdata)

        return (
            <SystemDataContext.Provider value = {this.state.system}>
                <UserDataContext.Provider value = {userdata}>
                    <MainView globalmessage={globalmessage}
                        className = {classes.mainviewstyle} 
                    />
                </UserDataContext.Provider>
            </SystemDataContext.Provider>
        )
    }
}

export default withStyles(styles)(Main)
