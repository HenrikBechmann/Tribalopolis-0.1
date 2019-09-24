// main.controller.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

/*
    bootstrap:
    1. index.html
    2. index.tsx
    3. main.controller
    4. main.view
    5. route.controller
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
import coredata from  '../data/coredata'

let fontFamily = coredata.theme.typography.fontFamily

import { DndProvider } from 'react-dnd'

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

import Userdata from '../utilities/userdata.class'

import 'react-toastify/dist/ReactToastify.min.css' 

import { ToastContainer, toast } from 'react-toastify'

import { withStyles, createStyles } from '@material-ui/core/styles'

import { 
    GetDocumentMessage, 
    SetListenerMessage, 
    DocpackPairPayloadMessage,
    DocpackPayloadMessage, 
} from '../services/interfaces'

import docProxy from '../utilities/docproxy'

import systemdata from '../data/system_data'

let styles = createStyles({
    mainviewstyle: {
        fontFamily,
    }
})

const beforeUnloadFunc = (ev) => 
        {  
            ev.preventDefault();
            alert('in before unload func')
            console.log('in before unload func')
            return ev.returnValue = 'Are you sure you want to close?';
        }

class Main extends React.Component<any,any> {

    constructor(props) {

        super(props)
        toast.info('resolving sign-in status...')
        authapi.setUpdateCallback(this.updateLoginData)
        // window.addEventListener("beforeunload", beforeUnloadFunc)
    }

    state = {
        loginraw:null,
        logindata:null,
        systempack:null,
        userpack:null,
        userclaimspack:null,
        accountpack:null,
    }

    mounted = false
    loginstatus = 'unresolved'

    systemPromise
    userPromise
    userClaimsPromise
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
        userclaims:{
            resolve:null,
            reject:null,
        },
        account:{
            resolve:null,
            reject:null,
        },
    }

    systemDocProxy = new docProxy({doctoken:{reference:'system/parameters'}})

    componentDidMount() {

        application.setSignoutCallback(this.signoutCallback)

    }

    signoutCallback = (finishSignout) => {
        // Note:the setState gives children a chance to unsubsribe from database.
        //    - this is a requirement, else subsequent connnection to the database fails
        //    - while waiting for permissions to be reset (must be clear of subscriptions)
        this.setState({
            loginraw:null,
            logindata:null,
            userpack:null,
            userclaimspack:null,
            accountpack:null,
        },() => {

            this.removeListeners()
            finishSignout()

        })

    }

    removeListeners = () => {

        this.systemDocProxy && application.removeDocpackListener({
            doctoken:this.systemDocProxy.doctoken,
            instanceid:this.systemDocProxy.instanceid
        })

        this.userDocProxy && application.removeDocpackListener({
            doctoken:this.userDocProxy.doctoken,
            instanceid:this.userDocProxy.instanceid
        })

        this.userClaimsDocProxy && application.removeDocpackListener({
            doctoken:this.userClaimsDocProxy.doctoken,
            instanceid:this.userClaimsDocProxy.instanceid
        })

        this.accountDocProxy && application.removeDocpackListener({
            doctoken:this.accountDocProxy.doctoken,
            instanceid:this.accountDocProxy.instanceid
        })

    }

    // This is notional. componentWillUnmount not run in most conditions on page refresh
    componentWillUnmount() {

        // window.removeEventListener("beforeunload", beforeUnloadFunc)

        this.removeListeners()

    }

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

        this.userClaimsPromise = new Promise((resolveuserclaims, rejectuserclaims) => {

            this.promises.userclaims.resolve = resolveuserclaims
            this.promises.userclaims.reject = rejectuserclaims

        })

        this.accountPromise = new Promise((resolveaccount, rejectaccount) => {

            this.promises.account.resolve = resolveaccount
            this.promises.account.reject = rejectaccount

        })

    }

    // ==============================[ TRIGGER: LOGIN DATA ]=========================================
    // including login, user, account data

    // this is set as a callback from auth.api -- called whenever login status changes
    updateLoginData = (loginraw) => {

        // console.log('getting updateLoginData',loginraw)

        this.updatinguserdata = true

        if (loginraw) {

            this.loginstatus = 'loggedin'

            this.setLoginPromises() 

            let logindata = Object.assign({},loginraw.providerData[0]) // google provider; shortcut for newuser data
            logindata.uid = loginraw.uid // google auth common uid
            console.log('logindata',logindata)
            this.getSystemDocument()
            this.getUserDocumentPair(logindata.uid) // and account document
            this.getUserClaimsDocument(logindata.uid)

            Promise.all([this.systemPromise, this.userPromise,this.userClaimsPromise,this.accountPromise ]).then(values => {

                this. updatinguserdata = false

                this.setState({
                    loginraw,
                    logindata,
                    systempack:values[0],
                    userpack:values[1],
                    userclaimspack:values[2],
                    accountpack:values[3],
                }, () => {
                    toast.success(`signed in as ${loginraw.displayName}, ${loginraw.email}`,{autoClose:2500})
                })

            }).catch(error => {

                this.updatinguserdata = false

                // toast.error(`unable to load user registration data for ${loginraw.email}`)
                console.log('unable to load user data. error: ',error)
                this.assertPartialLogin(systemdata.docpack, loginraw, logindata)
                // logout
                // application.signout()

            })

        } else { // clear userdata

            this.loginstatus = 'loggedout'

            this.resetSystemData()

        }

    }

    private assertPartialLogin = (systempack, loginraw, logindata) => {
        this.setState({
            loginraw,
            logindata,
            systempack,
        },() => {
            toast.warn('You are logged in but not registered')
        })
    }

    private resetWithSystempack = (systempack) => {

        this.updatinguserdata = false

        this.userTypePack = null
        this.userAccountTypePack = null
        this.setState({
            loginraw:null,
            logindata:null,
            userpack:null,
            systempack,
            accountpack:null,
        },() => {
            toast.info('signed out')
        })

    }

    resetSystemData = () => {

        this.resetWithSystempack(systemdata.docpack)

    }

    // ==============================[ SYSTEM DOCUMENT ]=========================================

    getSystemDocument = () => {

        let reference = this.systemDocProxy.doctoken.reference
        let instanceid = this.systemDocProxy.instanceid

        if (!application.docpackIsListener(reference,instanceid)) {
            let parm:SetListenerMessage = {
                doctoken:this.systemDocProxy.doctoken,
                instanceid:this.systemDocProxy.instanceid,
                success:this.systemDocumentSuccess,
                failure:this.systemDocumentFailure,
            }

            application.setDocpackListener(parm)
        }

    }

    systemDocumentSuccess = ({docpack, reason}:DocpackPayloadMessage) => {

        if ((!this.state.systempack) || this.updatinguserdata) {

            this.promises.system.resolve(docpack)

        } else {

            toast.success('updated system data')
            this.setState({
                systempack:docpack,
            })

        }
    }

    systemDocumentFailure = (error, reason) => {

        // toast.error('Error: Unable to get system data (' + error + ')')
        this.promises.system.reject('Unable to get system data (' + error + ')')
        console.log('Error: Unable to get system data:', error, reason)

    }

    // ==============================[ USER DOCUMENT ]=========================================


    getUserDocumentPair = uid => {

        if (this.userDocProxy) return

        this.userDocProxy = new docProxy({doctoken:{reference:'users/' + uid}})

        let parmblock:SetListenerMessage = {
            doctoken:this.userDocProxy.doctoken,
            instanceid:this.userDocProxy.instanceid,
            success:this.userDocumentPairSuccess,
            failure:this.userDocumentFailure,
        }

        application.setDocpackPairListener(parmblock)

    }

    userDocProxy = null
    accountDocProxy = null

    userDocumentFailure = error => {

        this.promises.user.reject('unable to get user data (' + error + ')')

    }

    userTypePack

    userDocumentPairSuccess = ({docpack,typepack,reason}:DocpackPairPayloadMessage) => {

        // console.log('userDocumentPairSuccess',docpack,typepack,reason)

        if (docpack.document === undefined) {
            application.removeDocpackPairListener({doctoken:this.userDocProxy.doctoken, instanceid:this.userDocProxy.instanceid})
            this.userDocumentFailure('no user record')
            return
        }

        this.userTypePack = typepack

        if ((!this.state.userpack) || this.updatinguserdata) {

            // toast.success('collecting user records...')

            this.promises.user.resolve(docpack)

            if (!this.accountDocProxy) {

                this.setAccountDocumentListener(docpack.document.control.account)
                // this.setAccountDocumentListener(docpack.document.control_account)

            } else {
                this.setState({
                    userpack:docpack,
                }, () => {
                    toast.info('updated user data')
                })
            }

        } else {
            this.setState({
                userpack:docpack,
            }, () => {
                toast.info('updated user data')
            })
        }

    }

    // ==============================[ USER CLAIMS DOCUMENT ]=========================================

    userClaimsDocProxy = null

    getUserClaimsDocument = (uid) => {

        if (this.userClaimsDocProxy) return

        this.userClaimsDocProxy = new docProxy({doctoken:{reference:'userclaims/' + uid}})

        let reference = this.userClaimsDocProxy.doctoken.reference
        let instanceid = this.userClaimsDocProxy.instanceid

        if (!application.docpackIsListener(reference,instanceid)) {
            let parm:SetListenerMessage = {
                doctoken:this.userClaimsDocProxy.doctoken,
                instanceid:this.userClaimsDocProxy.instanceid,
                success:this.userClaimsDocumentSuccess,
                failure:this.userClaimsDocumentFailure,
            }

            application.setDocpackListener(parm)
        }

    }

    userClaimsDocumentSuccess = ({docpack, reason}:DocpackPayloadMessage) => {

        // console.log('userClaimsDocumentSuccess',docpack,reason)
        if ((!this.state.userclaimspack) || this.updatinguserdata) {

            this.promises.userclaims.resolve(docpack)

        } else {

            toast.success('updated user status data')
            this.setState({
                userclaimspack:docpack,
            })

        }
    }

    userClaimsDocumentFailure = (error, reason) => {

        // toast.error('Error: Unable to get system data (' + error + ')')
        this.promises.userclaims.reject('Unable to get user claims data (' + error + ')')
        console.log('Error: Unable to get user claims data:', error, reason)

    }


    // ==============================[ ACCOUNT DOCUMENT ]=========================================

    setAccountDocumentListener = reference => {

        this.accountDocProxy = new docProxy({doctoken:{reference}})
        let parm:SetListenerMessage = {
            doctoken:this.accountDocProxy.doctoken,
            instanceid:this.accountDocProxy.instanceid,
            success:this.userAccountPairSuccess, 
            failure:this.userAccountFailure
        }

        application.setDocpackPairListener(parm)

    }

    userAccountTypePack = null

    userAccountPairSuccess = ({docpack,typepack, reason}:DocpackPairPayloadMessage) => {

        this.userAccountTypePack = typepack

        if (!docpack) {

            this.userAccountFailure('unable to get user account document')
            return

        }

        if ((!this.state.accountpack) || this.updatinguserdata) {

            this.promises.account.resolve(docpack)

        } else {

            this.setState({
                accountpack:docpack,
            }, () => {
                toast.info('updated account data')
            })

        }

    }

    userAccountFailure = error => {

        toast.error('unable to get account data' + error + ')')
        this.promises.account.reject('unable to get account data' + error + ')')

    }

    // ==============================[ RENDER ]=========================================

    render() {

        application.fontFamily = fontFamily // memoize fontFamily

        let { globalmessage, version, classes } = this.props

        let { logindata, userpack, accountpack } = this.state

        let userdata = new Userdata()

        Object.assign(userdata,{
            loginstatus:this.loginstatus,
            login:this.state.logindata,
            userpack:this.state.userpack,
            usertype:this.userTypePack,
            userclaimspack:this.state.userclaimspack,
            accountpack:this.state.accountpack,
            accounttype:this.userAccountTypePack,
        })

        console.log('new or updated userdata',userdata)

        application.userdata = userdata // memoize

        let systemdata = this.state.systempack?{parameters:(this.state.systempack.document)}:null

        application.systemdata = systemdata // memoize

        return (

            <SystemDataContext.Provider value = { systemdata }>
                <UserDataContext.Provider value = { userdata }>
                <DndProvider backend = {DnDBackend as any}>
                    <ToastContainer position = {toast.POSITION.BOTTOM_CENTER} autoClose = {3000} 
                    hideProgressBar />

                    <MainView 
                        globalmessage = {globalmessage}
                        className = {classes.mainviewstyle}
                        status = 'active' 
                    />
                    
                </DndProvider>
                </UserDataContext.Provider>
            </SystemDataContext.Provider>

        )
    }
}

export default withStyles(styles)(Main)

