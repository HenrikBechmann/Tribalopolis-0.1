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
import coredata from  '../data/coredata'

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

import 'react-toastify/dist/ReactToastify.min.css' 

import { ToastContainer, toast } from 'react-toastify'

import { withStyles, createStyles } from '@material-ui/core/styles'

import { 
    GetDocumentMessage, 
    SetListenerMessage, 
    ReturnDocPairMessage,
    ReturnDocPackMessage, 
} from '../services/interfaces'

import docProxy from '../utilities/docproxy'

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

@DragDropContext(DnDBackend as any) // any here to overcome typing inconsistency with latest react June 1 2019
class Main extends React.Component<any,any> {

    constructor(props) {

        super(props)
        toast.info('resolving sign-in status...')
        authapi.setUpdateCallback(this.updateLoginData)
        // window.addEventListener("beforeunload", beforeUnloadFunc)
    }

    state = {
        login:null,
        userData:null,
        systempack:null,
        userpack:null,
        accountpack:null,
    }

    mounted = false

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

    componentDidMount() {

        application.setSignoutCallback(this.signoutCallback)

    }

    signoutCallback = (finishSignout) => {
        // Note:the setState gives children a chance to unsubsribe from database.
        //    - this is a requirement, else subsequent connnection to the database fails
        //    - while waiting for permissions to be reset (must be clear of subscriptions)
        // console.log('resetting app state')
        this.setState({
            login:null,
            userData:null,
            userpack:null,
            accountpack:null,
        },() => {
            // console.log('removing listeners')
            this.removeListeners()
            finishSignout()
        })

    }

    removeListeners = () => {

        // console.log('remove listeners for sign out', this.systemDocProxy)

        this.systemDocProxy && application.removeDocpackListener({
            doctoken:this.systemDocProxy.doctoken,
            instanceid:this.systemDocProxy.instanceid
        })

        this.userDocProxy && application.removeDocpackListener({
            doctoken:this.userDocProxy.doctoken,
            instanceid:this.userDocProxy.instanceid
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

            this.setLoginPromises() 

            let loginlocal = Object.assign({},login.providerData[0]) // google provider; shortcut for newuser data
            loginlocal.uid = login.uid // google auth common uid

            let userData = loginlocal // only google for now
            this.getSystemDocument()
            this.getUserDocument(userData.uid) // and account document

            Promise.all([this.userPromise,this.accountPromise, this.systemPromise]).then(values => {

                this. updatinguserdata = false

                this.setState({
                    login,
                    userData,
                    userpack:values[0],
                    accountpack:values[1],
                    systempack:values[2],
                }, () => {
                    toast.success(`signed in as ${login.displayName}`,{autoClose:2500})
                })

            }).catch(error => {

                this.updatinguserdata = false

                toast.error('unable to get user data - signing out (' + error + ')')
                // logout
                application.signout()

            })

        } else { // clear userdata

            this.getSystemData()

        }

    }

    getSystemData = () => {

        this.setSystemPromise()

        this.getSystemDocument()

        this.systemPromise.then((systempack) => {

            // console.log('updating state with empty login')

            this.updatinguserdata = false

            this.userTypePack = null
            this.userAccountTypePack = null
            this.setState({
                login:null,
                userData:null,
                userpack:null,
                systempack,
                accountpack:null,
            },() => {
                toast.info('signed out')
            })

        }).catch(error => {

            this.updatinguserdata = false

            toast.error('unable to set system data ' + error)

            this.userTypePack = null
            this.userAccountTypePack = null
            this.setState({
                login:null,
                userData:null,
                userpack:null,
                systempack:null,
                accountpack:null,
            })

        })

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

    systemDocumentSuccess = ({docpack, reason}:ReturnDocPackMessage) => {

        if ((!this.state.systempack) || this.updatinguserdata) {

            this.promises.system.resolve(docpack)

        } else {

            toast.success('updated system data')
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

        // console.log('getUserDocument:uid',uid)

        let parms:GetDocumentMessage = {
            reference:'users',
            whereclauses:[['properties.loginid.uid','==',uid]],
            success:this.userDocumentSuccess, 
            failure:this.userDocumentFailure,
        }
        application.queryForDocument(parms)

    }

    userDocProxy = null
    accountDocProxy = null

    userDocumentSuccess = ({docpack, reason}:ReturnDocPackMessage) => {

        // console.log('userDocumentSuccess: docpack, userDocProxy', docpack, this.userDocProxy)

        if (this.userDocProxy) return

        this.userDocProxy = new docProxy({doctoken:{reference:docpack.reference}})
        // console.log('userDocumentSuccess',docpack,this.userDocProxy)
        let parmblock:SetListenerMessage = {
            doctoken:this.userDocProxy.doctoken,
            instanceid:this.userDocProxy.instanceid,
            success:this.userDocumentPairSuccess,
            failure:this.userDocumentFailure,
        }

        application.setDocpackPairListener(parmblock)

    }

    userDocumentFailure = error => {

        toast.error('unable to get user data (' + error + ')')
        this.promises.user.reject('unable to get user data (' + error + ')')

    }

    userTypePack

    userDocumentPairSuccess = ({docpack,typepack,reason}:ReturnDocPairMessage) => {

        this.userTypePack = typepack

        if ((!this.state.userpack) || this.updatinguserdata) {

            toast.success('collecting user records...')

            // console.log('setting user record in UserDocumentPairSuccess',docpack)
            this.promises.user.resolve(docpack)

            if (!this.accountDocProxy) {

                // this.setAccountDocumentListener(docpack.document.control.account)
                this.setAccountDocumentListener(docpack.document.control_account)

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

    userAccountPairSuccess = ({docpack,typepack, reason}:ReturnDocPairMessage) => {

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

        let { userData, userpack, accountpack } = this.state

        let userdata

        if (!(userData && userpack && accountpack)) {

            userdata = null
            
        } else {

            userdata = {
                login:this.state.userData,
                userpack:this.state.userpack,
                usertype:this.userTypePack,
                accountpack:this.state.accountpack,
                accounttype:this.userAccountTypePack,
            }

        }

        application.userdata = userdata // memoize

        let systemdata = this.state.systempack?{parameters:(this.state.systempack.document)}:null

        application.systemdata = systemdata // memoize

        console.log('systemdata and userdata in main.controller',systemdata,userdata)

        return (

            <SystemDataContext.Provider value = { systemdata }>
                <UserDataContext.Provider value = { userdata }>

                    <ToastContainer position = {toast.POSITION.BOTTOM_LEFT} autoClose = {3000} 
                    hideProgressBar />

                    <MainView globalmessage={globalmessage}
                        className = {classes.mainviewstyle} 
                    />
                    
                </UserDataContext.Provider>
            </SystemDataContext.Provider>

        )
    }
}

export default withStyles(styles)(Main)

