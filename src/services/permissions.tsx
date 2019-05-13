// permissions.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import application from '../services/application'
import { toast } from 'react-toastify'
import docProxy from '../utilities/docproxy'
import { 
    GetDocumentMessage, 
    SetListenerMessage
} from '../services/interfaces'

class permissions {

    constructor(onPermissions) {
        this.onPermissions = onPermissions
    }

    controldata = {
        systemdata:null,
        userdata:null,
        activememberdata:null,
        activeaccountdata:null,
    }

    contextAccountProxy = null
    contextMemberProxy = null

    onPermissions

    public updateControlData = (
        {
            systemdata, 
            userdata, 
            activeaccountreference, 
            stateaccountreference
        }
    ) => {

        if (!userdata) {
            this.removeContextListeners()
        }

        // keep systemdata and userdata up to date in any case
        this.controldata.systemdata = systemdata
        this.controldata.userdata = userdata

        if (activeaccountreference == stateaccountreference) return false // don't refresh

        // if there has been a change in active accountreference
        this.controldata.activeaccountdata = null
        this.controldata.activememberdata = null

        if (activeaccountreference) { // if there is an active account reference

            this.fetchContextAccount(activeaccountreference)

        }

        return true // refresh

    }

    public controlStatus = () => {

        let controlstatus:boolean | string = false

        if (this.controldata.systemdata && this.controldata.userdata) {
            controlstatus = 'base'
        }
        if (controlstatus && this.controldata.activememberdata && this.controldata.activeaccountdata) {
            controlstatus = 'full'
        }
        return controlstatus
    }

    public removeContextListeners = () => {

        if (this.contextMemberProxy) {
            let {doctoken,instanceid} = this.contextMemberProxy
            application.removeDocpackPairListener({doctoken, instanceid})
            this.contextMemberProxy = null
        }

        if (this.contextAccountProxy) {
            let {doctoken, instanceid} = this.contextAccountProxy
            application.removeDocpackPairListener({doctoken,instanceid})
            this.contextAccountProxy = null
        }

    }

    // --------------------[ get permission data ]------------------------
    /*
        subscribe to active account
        get member record reference
        subscribe to active member document
    */

    private fetchContextAccount = (accountreference) => {

        if (this.contextAccountProxy) {
            let {doctoken, instanceid} = this.contextAccountProxy
            application.removeDocpackPairListener({doctoken,instanceid})
            this.contextAccountProxy = null
        }

        this.controldata.activeaccountdata = null
        this.controldata.activememberdata = null

        let proxy = this.contextAccountProxy = new docProxy({doctoken:{reference:accountreference}})
        let parms:SetListenerMessage = {
            doctoken:proxy.doctoken,
            instanceid:proxy.instanceid,
            success:this.contextAccountSuccess,
            failure:this.contextAccountFailure,
        }

        application.setDocpackPairListener(parms)

    }

    private contextAccountSuccess = ({docpack,typepack,reason}) => {

        let update = (
            this.controldata.activeaccountdata && 
            (this.controldata.activeaccountdata.docpack.reference == docpack.reference))

        this.controldata.activeaccountdata = {
            docpack,
            typepack,
        }

        if (!update) {
            this.fetchMemberRecord()
        }

    }

    private contextAccountFailure = (error) => {

        toast.error('could not get context account record',error)

    }

    private fetchMemberRecord = () => {

        let parms:GetDocumentMessage = {
            reference:'members',
            whereclauses:[
                ['properties.useraccount','==',this.controldata.userdata.accountpack.reference],
                ['properties.account','==',this.controldata.activeaccountdata.docpack.reference],
            ],
            success:this.fetchMemberSuccess, 
            failure:this.fetchMemberFailure,
        }

        application.queryForDocument(parms)

    }

    // fetch member and subscribe if new
    private fetchMemberSuccess = ({docpack, reason}) => {

        let uptodate = (
            this.controldata.activememberdata && 
            (this.controldata.activememberdata.docpack.reference == docpack.reference))

        if (uptodate) return
            
        if (this.contextMemberProxy) {
            let {doctoken,instanceid} = this.contextMemberProxy
            application.removeDocpackPairListener({doctoken, instanceid})
            this.contextMemberProxy = null
        }

        let proxy = this.contextMemberProxy = new docProxy({doctoken:{reference:docpack.reference}})
        let parms:SetListenerMessage = {
            doctoken:proxy.doctoken,
            instanceid:proxy.instanceid,
            success:this.contextMemberSuccess,
            failure:this.contextMemberFailure,
        }
        application.setDocpackPairListener(parms)

    }

    private fetchMemberFailure = (error) => {

        toast.warn('could not get context account member: ' + error)

    }

    private contextMemberSuccess = ({docpack,typepack,reason}) => {

        this.controldata.activememberdata = {
            docpack,
            typepack,
        }        

        this.onPermissions()

    }

    private contextMemberFailure = (error) => {

        toast.error('could not subscribe to context account member: ' + error)

    }

}

export default permissions