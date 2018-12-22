// main.controller.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

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
    - switch to setDocumentListener from getDocument
    - use setDocumentListener for user/account to sync with type
    - upgrade getDocument to getAsyncDocument == 'documentSubscribe'
    - defend against race condition of multiple adjacent async updates: 
        sentinel for state, user, account updates
    - handle network failure - system data
    - add general error catch lifecycle method
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

// import DnDManager from 'react-dnd'

import application from '../services/application'

let isMobile = application.properties.ismobile

let DnDBackend = isMobile?DnDTouchBackend:DnDHtml5Backend

import MainView from './main.view'

import authapi from '../services/auth.api'
import UserDataContext from '../services/userdata.context'
import SystemDataContext from '../services/systemdata.context'

import { toast } from 'react-toastify'

import { withStyles, createStyles } from '@material-ui/core/styles'

import { GetDocumentMessage, SetListenerMessage, ReturnDocPackMessage } from '../services/interfaces'

import docProxy from '../utilities/docproxy'

let styles = createStyles({
    mainviewstyle: {
        fontFamily:fontFamily,
    }
})


@DragDropContext(DnDBackend)
class Main extends React.Component<any,any> {

    constructor(props) {

        super(props)
        toast.info('resolving login status...')
        authapi.setUpdateCallback(this.updateLoginData) 

    }

    state = {
        login:null,
        userProviderData:null,
        systempack:null,
        userpack:null,
        accountpack:null,
    }

    systemPromise
    userPromise
    accountPromise

    updatinguserdata // sentinel

    promises = {
        system:{
            resolve:null,
            reject:null,
        },
        user:{
            resolve:null,
            reject:null,
        },
        account:{
            resolve:null,
            reject:null,
        },
    }

    systemDocProxy = new docProxy({doctoken:{reference:'/system/parameters'}})

    setSystemPromise = () => {

        this.systemPromise = new Promise((resolvesystem, rejectsystem) => {

            this.promises.system.resolve = resolvesystem
            this.promises.system.reject = rejectsystem

        })

    }

    setLoginPromises = () => {

        this.setSystemPromise()

        this.userPromise = new Promise((resolveuser, rejectuser) => {

            this.promises.user.resolve = resolveuser
            this.promises.user.reject = rejectuser

        })

        this.accountPromise = new Promise((resolveaccount, rejectaccount) => {

            this.promises.account.resolve = resolveaccount
            this.promises.account.reject = rejectaccount

        })

    }

    // ==============================[ TRIGGER: LOGIN DATA ]=========================================
    // including login, user, account data

    updateLoginData = (login) => {

        // console.log('update login object',login)

        this.updatinguserdata = true

        if (login) {

            if (!this.state.login) {

                toast.success(`signed in as ${login.displayName}`,{autoClose:2500})

            } else {

                toast.success(`updated data for ${login.displayName}`,{autoClose:2500})

            }

            this.setLoginPromises() 

            let userProviderData = login.providerData[0] // only google for now
            this.getSystemDocument()
            this.getUserDocument(userProviderData.uid) // and account document

            Promise.all([this.userPromise,this.accountPromise, this.systemPromise]).then(values => {

                this. updatinguserdata = false

                this.setState({
                    login,
                    userProviderData,
                    userpack:values[0],
                    accountpack:values[1],
                    systempack:values[2],
                })

            }).catch(error => {

                this.updatinguserdata = false

                toast.error('unable to get user data - signing out (' + error + ')')
                // logout
                authapi.googlesignout()

            })

        } else { // clear userdata

            this.setSystemPromise()

            this.getSystemDocument()

            this.systemPromise.then((systempack) => {

                // console.log('updating state with empty login')

                this.updatinguserdata = false

                this.setState({
                    login:null,
                    userProviderData:null,
                    userpack:null,
                    systempack,
                    accountpack:null,
                })

            }).catch(error => {

                this.updatinguserdata = false

                toast.error('unable to set system data ' + error)

                this.setState({
                    login:null,
                    userProviderData:null,
                    userpack:null,
                    systempack:null,
                    accountpack:null,
                })

            })

        }

    }

    // ==============================[ SYSTEM DOCUMENT ]=========================================

    getSystemDocument = () => {

        let parm:SetListenerMessage = {
            doctoken:this.systemDocProxy.doctoken,
            instanceid:this.systemDocProxy.instanceid,
            success:this.systemDocumentSuccess,
            failure:this.systemDocumentFailure,
        }

        application.setDocpackListener(parm)

    }

    systemDocumentSuccess = ({docpack, reason}:ReturnDocPackMessage) => {

        if (!docpack) return

        console.log('system from systemDocumentSuccess',docpack)

        if ((!this.state.systempack) || this.updatinguserdata) {

            toast.success('setting system data')
            this.promises.system.resolve(docpack)

        } else {

            toast.success('updating system data')
            this.setState({
                systempack:docpack,
            })

        }
    }

    systemDocumentFailure = error => {

        toast.error('Unable to get system data (' + error + ')')
        this.promises.system.reject('Unable to get system data (' + error + ')')

    }

    // ==============================[ USER DOCUMENT ]=========================================

    getUserDocument = uid => {

        let parms:GetDocumentMessage = {
            reference:'users',
            whereclauses:[['identity.loginid.uid','==',uid]],
            success:this.userDocumentSuccess, 
            failure:this.userDocumentFailure,
        }
        application.queryForDocument(parms)

    }

    userDocumentSuccess = ({docpack, reason}:ReturnDocPackMessage) => {

        console.log('user from userDocumentSuccess',docpack)

        if ((!this.state.userpack) || this.updatinguserdata) {

            toast.success('setting user record')
            this.promises.user.resolve(docpack)
            this.getAccountDocument(docpack.document.identity.account)

        } else {

            this.setState({
                userpack:docpack,
            })
        }

    }

    userDocumentFailure = error => {

        toast.error('unable to get user data (' + error + ')')
        this.promises.user.reject('unable to get user data (' + error + ')')

    }

    // ==============================[ ACCOUNT DOCUMENT ]=========================================

    getAccountDocument = reference => {

        let parm:GetDocumentMessage = {
            reference,
            success:this.userAccountSuccess, 
            failure:this.userAccountFailure
        }
        application.getDocument(parm)

    }

    userAccountSuccess = ({docpack, reason}:ReturnDocPackMessage) => {

        console.log('account from accountDocumentSuccess',docpack)

        if (!docpack) {

            this.userAccountFailure('unable to get user account document')
            return

        }

        if ((!this.state.accountpack) || this.updatinguserdata) {

            toast.success('setting account record')
            this.promises.account.resolve(docpack)

        } else {

            this.setState({
                accountpack:docpack,
            })

        }

    }

    userAccountFailure = error => {

        toast.error('unable to get account data' + error + ')')
        this.promises.account.reject('unable to get account data' + error + ')')

    }

    // ==============================[ RENDER ]=========================================

    render() {

        let { globalmessage, version, classes } = this.props

        let { userProviderData, userpack, accountpack } = this.state

        let userdata

        if (!(userProviderData && userpack && accountpack)) {

            userdata = null
            
        } else {

            userdata = {
                login:this.state.userProviderData,
                userpack:this.state.userpack,
                accountpack:this.state.accountpack,
            }

        }

        let systemdata = this.state.systempack?this.state.systempack.document:null

        return (

            <SystemDataContext.Provider value = {systemdata}>
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
