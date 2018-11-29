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
        (user and account document listeners)
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
        authapi.setUpdateCallback(this.updateUserData) // (this.getUserCallback)
    }

    state = {
        login:null,
        userProviderData:null,
        system:null,
        user:null,
        account:null,
    }

    promises = {
        user:{
            resolve:null,
            reject:null,
        },
        account:{
            resolve:null,
            reject:null,
        },
    }

    userPromise = new Promise((resolveuser, rejectuser) => {

        this.promises.user.resolve = resolveuser
        this.promises.user.reject = rejectuser

    })

    accountPromise = new Promise((resolveaccount, rejectaccount) => {
        this.promises.account.resolve = resolveaccount
        this.promises.account.reject = rejectaccount
    })

    updateUserData = (login) => {

        if (login) {
            toast.success(`signed in as ${login.displayName}`,{autoClose:2500})
            let userProviderData = login.providerData[0] // only google for now
            this.getUserDocument(userProviderData.uid)
            Promise.all([this.userPromise,this.accountPromise]).then(values => {
                this.setState({
                    login,
                    userProviderData,
                    user:values[0],
                    account:values[1],
                })
            }).catch(error => {
                toast.error('unable to get user data (' + error + ')')
                // logout
                authapi.googlesignout()
            })
        } else { // clear userdata
            this.setState({
                login:null,
                userProviderData:null,
                user:null,
                account:null,
            })
        }

    }

    getSystemData = () => {
        application.getDocument('/system/parameters',this.getSystemDataCallback,this.getSystemDataError)
    }

    getSystemDataCallback = data => {

        toast.success('setting system data')
        this.setState({
            system:data,
        })

    }

    getSystemDataError = error => {

        toast.error('Unable to get system data (' + error + ')')

    }

    getUserDocument = uid => {

        application.queryCollection('users',[['identity.loginid.uid','==',uid]],this.userDocumentSuccess, this.userDocumentFailure)

    }

    userDocumentSuccess = doclist => {

        // console.log('doclist from userdoc',doclist)
        if (!doclist.length) {
            this.userDocumentFailure('no user document found')
            return
        }
        if (doclist.length > 1) {
            // toast.error('duplicate user id')
            this.userDocumentFailure('duplicate user id')
            return
        }
        toast.success('setting user record')
        let user = doclist[0]
        this.promises.user.resolve(user)
        this.getAccountDocument(user.data.identity.account)

    }

    userDocumentFailure = error => {
        toast.error('unable to get user data (' + error + ')')
        this.promises.user.reject('unable to get user data (' + error + ')')
    }

    getAccountDocument = reference => {
        application.getDocument(reference,this.userAccountSuccess, this.userAccountFailure)
    }

    userAccountSuccess = (document,id) => {

        if (!document) {
            this.userAccountFailure('unable to get user account document')
            return
        }

        let docpack = {
            data:document,
            id,
        }

        toast.success('setting account record')
        this.promises.account.resolve(docpack)

    }

    userAccountFailure = error => {

        toast.error('unable to get account data' + error + ')')
        this.promises.account.reject('unable to get account data' + error + ')')

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
