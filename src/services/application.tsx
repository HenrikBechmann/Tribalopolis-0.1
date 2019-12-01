// application.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later
/*
    This is the high level application controller
    It's main responsibility is to co-ordinate the store and the domain
    application -> datamodel + viewmodel -> domain -> gateway -> firebase

    source code style:
    local functions are prefixed with underscrore (_)
    parameters between modules are parmblocks
*/

/*
    TODO: 

        - process document changed by type in processDocumentCallbacks

        - OPTIMIZE!! Maintain cache items by some criterion such as usage or age
        - rationalize "change" object
        - add CREATED, UPDATED, LASTUSED, and USAGECOUNT stamps to cache items
        - implement state item garbage collection (no listeners)
        - implement general max for cache (1000?) with trigger to reduce to 900 or so
*/

'use strict'

// import merge from 'deepmerge'
// import deepdiff from 'deep-diff'

import merge from 'deepmerge'
import { toast } from 'react-toastify'
import gateway from './gateway'
import Proxy from '../utilities/docproxy'
import { 
    GetDocumentMessage, 
    SetDocumentMessage,

    GetCollectionMessage,

    SetListenerMessage,
    SetNewListenerMessage,
    RemoveListenerMessage,

    DocpackPayloadMessage,
    DocpackPairPayloadMessage,
    DocPackStruc,

    PostFormMessage,
    GenericObject,
    
} from './interfaces'
import docpackCache from './application/docpackcache'
import typepackCache from './application/typepackcache'
import authapi from './auth.api'
import functions from './functions'
import utilities from '../utilities/utilities'
import firebase from './firebase.api'
import verification from './verification.filter'

// ==============[ Internal ]===============

/*
    Each document has an accompanying type. Types are shared, therefore far less numerous.
    The separation of the two allows for separate caching strategies.
*/

/*
    Sentinels are kept for each session instance of an entity, in a first in last out queue
    the earliest sentinel is checked for stop (== true), in which case the latest cache listener
    sentinel registration is stopped. If the sentinel doesn't exist or is false (false == continue), then
    the current sentinel is added as false (continue)

    callbacksentinels are used by the docpackcache to determine if the listener should be called. If the last sentinel 
    is stopped then the callback does not happen, as the listener is in the process of being abandoned.
*/
export const callbacksentinels = {}
const BLOCK = true
const ALLOW = false

// =================[ API ]=======================

const application = new class {

    public properties = {

        ismobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

    }


    private fontFamilyMemo = null

    private userdataMemo = null
    private systemdataMemo = null

    private signoutCallback

    // =================[ PRIVATE ]=======================

    // set sentinel for continue unless already blocked, then remove and abandon.
    // sentinels are set for only one entity in a session
    private setCallbackSentinalToContinue = instanceid => {

        let sentinel = callbacksentinels[instanceid]? // previously set sentinel
            callbacksentinels[instanceid][0]:
            undefined

        if (sentinel === undefined) { // if none, create sentinel for continuation

            callbacksentinels[instanceid]=[ALLOW] // allow continuation callbacks
            return ALLOW

        } else if (sentinel === BLOCK) { // block was set; clear sentinal; abandon, removal is underway

            callbacksentinels[instanceid].shift() // no longer needed

            if (callbacksentinels[instanceid].length === 0) {

                delete callbacksentinels[instanceid]

            }

            return BLOCK

        } else { // sentinel == ALLOW; continue with callbacks

            callbacksentinels[instanceid].push(ALLOW)
            return ALLOW

        }

    }

    private setCallbackSentinalToBlock = instanceid => {

        let sentinel = 
            callbacksentinels[instanceid]?
            callbacksentinels[instanceid][0]:
            undefined

        if (sentinel === undefined) { // create sentinal; removal set before listener set

            callbacksentinels[instanceid]=[BLOCK]

            return

        } else if (sentinel === ALLOW) { // clear sentinal

            callbacksentinels[instanceid].shift()

            if (callbacksentinels[instanceid].length === 0) {

                delete callbacksentinels[instanceid]
            }

        } else { // sentinal === BLOCK; was set for previous call; queue next

            callbacksentinels[instanceid].push(BLOCK)

            return
        }

    }

    // =================[ API ]=======================
    // called from component componentDidMount or componentWillUpdate

    public setDocpackListener = ({doctoken, instanceid, success, failure}:SetListenerMessage) => {

        setTimeout(()=>{ // give animations a chance to run

            let reference = doctoken.reference // getTokenReference(doctoken)

            if (this.setCallbackSentinalToContinue(instanceid) === BLOCK) return

            docpackCache.addListener(reference, instanceid, success, failure)

            let docpack:DocPackStruc = docpackCache.getCacheDocpack(reference)

            if (docpack) { // defer if waiting for docpack

                let parmblock:DocpackPayloadMessage = {
                    docpack, 
                    reason:{
                        documents:{
                            reason:'newcallback',
                            document:true, 
                            type:true,
                        }
                    }
                }

                success(parmblock)

            }

        })

    }

    // this maps collection, documentid and typereference to message for setDocpackPairListener
    public setNewDocpackPairListener = (parmblock:SetNewListenerMessage) => {
        // console.log('in setNewDocpackPairListener',parmblock)
        let { collection, customid, success, failure, typereference } = parmblock
        // TODO change if the following is asynchronous
        let documentid:string
        if (!customid) {
            let documentref = gateway.getNewDocumentRef({collection})
            // console.log('created documentref',documentref)
            documentid = documentref.id
        } else {
            documentid = customid
        }
        let reference = collection + '/' + documentid
        // console.log('created new document reference',reference)
        let docProxy = new Proxy({doctoken:{reference}})
        let newdocument = {
            reference,
            typereference,
        }
        let parms:SetListenerMessage = {
            doctoken:docProxy.doctoken,
            instanceid:docProxy.instanceid,
            newdocument,
            success,
            failure,
        }
        // console.log('setNewDocpackPairListener results: parmblock, documentid, reference, docProxy, parms',parmblock, documentid, reference, docProxy, parms)
        this.setDocpackPairListener(parms)
        return docProxy
    }

    public setDocpackPairListener = (parmblock:SetListenerMessage) => {

        // console.log('setDocpackPairListener in application',parmblock )
        let {doctoken, instanceid, success, failure, newdocument} = parmblock
        
        let reference = doctoken.reference 

        // console.log('SENTINEL blocking = ',(this.setCallbackSentinalToContinue(instanceid) === BLOCK))

        if (this.setCallbackSentinalToContinue(instanceid) === BLOCK) return

        // this initiates a call for the type document
        docpackCache.addPairedListener(reference, instanceid, success, failure, newdocument)

        let cachedata = docpackCache.getCacheDocpackPair(reference, newdocument)

        // console.log('application setDocpackPairListener: cachedata, parmblock',cachedata, parmblock)

        if (cachedata.docpack && cachedata.typepack) { // defer if waiting for type
            let docpack:DocPackStruc = cachedata.docpack

            let parmblock:DocpackPairPayloadMessage = {
                docpack, 
                typepack:cachedata.typepack, 
                reason:{
                    documents:{
                        reason:'newcallback',
                        document:true, 
                        type:true,
                    }
                }
            }

            success(parmblock)

        }

    }

    public removeDocpackListener = ({doctoken, instanceid}:RemoveListenerMessage) => {

        let reference = doctoken.reference

        this.setCallbackSentinalToBlock(instanceid)

        docpackCache.removeListener(reference,instanceid)

    }

    // called from component componentWillUnmount
    public removeDocpackPairListener = ({doctoken, instanceid}:RemoveListenerMessage) => {

        let reference = doctoken.reference

        this.setCallbackSentinalToBlock(instanceid)

        docpackCache.removeListener(reference,instanceid)

    }

    public getDocument = (parmblock:GetDocumentMessage) => {

        gateway.getDocument(parmblock)

    }

    public getNewDocument = (parmblock:GetDocumentMessage) => {

        gateway.getNewDocument(parmblock)

    }

    public queryForDocument = (parmblock:GetDocumentMessage) => {

        gateway.queryForDocument(parmblock)
        
    }

    public get fontFamily() {
        return this.fontFamilyMemo
    }

    public set fontFamily(value) {
        this.fontFamilyMemo = value
    }

    public get userdata() {
        return this.userdataMemo 
    }

    public set userdata(value) {
        this.userdataMemo = value
    } 

    public get systemdata() {
        return this.systemdataMemo
    }

    public set systemdata(value) {
        this.systemdataMemo = value
    } 

    public setDocument = (parmblock:SetDocumentMessage) => {

        gateway.setDocument(parmblock)

    }

    public getCollection = (parmblock:GetCollectionMessage) => {

        gateway.getCollection(parmblock)
        
    }

    public docpackIsListener = (reference, instanceid) => {

        return docpackCache.isListener(reference,instanceid)

    }

    // ======================[ sign in and out ]====================

    public signin = () => {
        authapi.googlesignin()
    }

    public signout = () => {
        this.signoutCallback(this.completeSignout)
    }

    public completeSignout = () => {

        setTimeout(() => {
            // remove all subscriptions
            authapi.googlesignout()
        })

    }

    public setSignoutCallback = signoutCallback => {
        this.signoutCallback = signoutCallback
    }


    // to be used with basic datapane forms
    public submitDocument = ( parms:PostFormMessage ) => {

        // console.log('submitDocument',parms)

        let { formcontext, success, failure } = parms

        let { namespace, documentmap, form } = formcontext
        
        let { docpack, typepack } = formcontext.dbdata
        let newdocpack:GenericObject = merge({},docpack)

        let formstate = form.state

        let properties = null, severity = 0, code = null, message = null, index = null, value;
        for ( index in formstate.values) {

            value = formstate.values[index]

            let path = documentmap[index].split('.')

            let typedoc = typepack.document

            if (value === undefined) value = null;
            
            [value, properties, severity, code, message] = verification.verifyOutgoingValue(value, path, typedoc)

            if (severity == 2) break;

            if (severity == 1) {
                toast.warn(message)
            }

            let nodespecs = utilities.getNodePosition(newdocpack.document,path)
            nodespecs && (nodespecs.nodeproperty[nodespecs.nodeindex] = value)

        } 

        if (!severity || (severity == 1)) {
            let message = {
                document:newdocpack.document,
                reference:docpack.reference,
                success,
                failure,
            }

            application.setDocument(message)
        } else {
            if (failure) {

                failure(
                    message,
                    {
                        reference:docpack.reference,
                        sourcparms:parms,
                        results:{
                            value,properties,severity,code,message,index
                        }
                    }
                )

            } else {

                throw 'submitDocument failure but no failure callback'
                console.log('submitDocument failure but no failure callback: parms',parms)

            }
            // TODO: does lack of nodespecs constitute failure? YES
        }

    }

}

export default application
