// services.tsx
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

import merge from 'deepmerge'
import deepdiff from 'deep-diff'

import gateway from './gateway'
import Proxy from '../utilities/docproxy'
import { 
    GetDocumentMessage, 
    SetDocumentMessage,

    GetCollectionMessage,

    SetListenerMessage,
    RemoveListenerMessage,

    DocpackPayloadMessage,
    DocpackPairPayloadMessage,
    DocPackStruc,
    
} from './interfaces'
import docpackCache from './application/docpackcache'
import typepackCache from './application/typepackcache'
import authapi from './auth.api'
import functions from './functions'
import utilities from '../utilities/utilities'
import firebase from './firebase.api'

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

const appManager = new class {

    properties = {

        ismobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

    }


    private fontFamilyMemo = null

    private userdataMemo = null
    private systemdataMemo = null

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

    setDocpackListener = ({doctoken, instanceid, success, failure}:SetListenerMessage) => {

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

    setNewDocpackPairListener = (parmblock) => {
        console.log('called setNewDocpackPairListener',parmblock)
        let { collection, customid, success, failure, typereference } = parmblock
        // TODO change if the following is asynchronous
        let documentid
        if (!customid) {
            let documentref = (customid || gateway.getNewDocumentRef({collection}))
            console.log('created documentref',documentref)
            documentid = documentref.id
        } else {
            documentid = customid
        }
        console.log('created documentid',documentid)
        let reference = collection + '/' + documentid
        let docProxy = new Proxy({doctoken:{reference}})
        let parms:SetListenerMessage = {
            doctoken:docProxy.doctoken,
            instanceid:docProxy.instanceid,
            typereference,
            success,
            failure,
        }
        console.log('setNewDocPairListener: parmblock, documentid, reference, docProxy, parms',parmblock, documentid, reference, docProxy, parms)
        this.setDocpackPairListener(parms)
        return docProxy
    }

    setDocpackPairListener = (parmblock:SetListenerMessage) => {

        // console.log('setDocPackPairListener in application',parmblock )
        let {doctoken, instanceid, success, failure, typereference} = parmblock
        setTimeout(()=>{ // give animations a chance to run

            let reference = doctoken.reference 

            if (this.setCallbackSentinalToContinue(instanceid) === BLOCK) return

            docpackCache.addPairedListener(reference, instanceid, success, failure, typereference)

            let cachedata = docpackCache.getCacheDocpackPair(reference, typereference)

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

        })

    }

    removeDocpackListener = ({doctoken, instanceid}:RemoveListenerMessage) => {

        let reference = doctoken.reference

        this.setCallbackSentinalToBlock(instanceid)

        docpackCache.removeListener(reference,instanceid)

    }

    // called from component componentWillUnmount
    removeDocpackPairListener = ({doctoken, instanceid}:RemoveListenerMessage) => {

        let reference = doctoken.reference

        this.setCallbackSentinalToBlock(instanceid)

        docpackCache.removeListener(reference,instanceid)

    }

    getDocument = (parmblock:GetDocumentMessage) => {

        gateway.getDocument(parmblock)

    }

    getNewDocument = (parmblock:GetDocumentMessage) => {

        gateway.getNewDocument(parmblock)

    }

    queryForDocument = (parmblock:GetDocumentMessage) => {

        gateway.queryForDocument(parmblock)
        
    }

    get fontFamily() {
        return this.fontFamilyMemo
    }

    set fontFamily(value) {
        this.fontFamilyMemo = value
    }

    get userdata() {
        return this.userdataMemo 
    }

    set userdata(value) {
        this.userdataMemo = value
    } 

    get systemdata() {
        return this.systemdataMemo
    }

    set systemdata(value) {
        this.systemdataMemo = value
    } 

    setDocument = (parmblock:SetDocumentMessage) => {

        gateway.setDocument(parmblock)

    }

    getCollection = (parmblock:GetCollectionMessage) => {

        gateway.getCollection(parmblock)
        
    }

    docpackIsListener = (reference, instanceid) => {

        return docpackCache.isListener(reference,instanceid)

    }

    // ======================[ sign in and out ]====================

    signin = () => {
        authapi.googlesignin()
    }

    signout = () => {
        this.signoutCallback(this.completeSignout)
    }

    completeSignout = () => {

        setTimeout(() => {
            // remove all subscriptions
            authapi.googlesignout()
        })

    }

    signoutCallback

    setSignoutCallback = signoutCallback => {
        this.signoutCallback = signoutCallback
    }

    private processIncomingDatatypes = (diffs, datadocument, originaldocument) => {

        for (let diff of diffs) {

            let { kind, path, rhs:datatype, lhs:incomingvalue } = diff

            if (kind != 'E') {
                console.log('WARNING: unmatched incoming datatype',diff)
                continue
            }

            if (datatype == '??timestamp' && incomingvalue !== null) {

                let originalnode = utilities.getNodePosition(originaldocument,path)
                if (!originalnode) {
                    console.error('nodepositoin not found in application.processIncomingDataTypes',diff)
                    continue
                }

                let value
                try {
                    value =  originalnode.nodevalue.toDate()
                } catch (e) { // try to self-heal
                    value = originalnode.nodevalue // try to convert to date through new Timestamp
                    if (value.seconds !== undefined && value.nanoseconds !== undefined) {
                        value = new firebase.firestore.Timestamp(value.seconds, value.nanoseconds)
                        value = value.toDate()
                    }
                }

                let datanode = utilities.getNodePosition(datadocument,path)
                datanode.nodeproperty[datanode.nodeindex] = value

            }

        }

        return datadocument
    }

    private processOutgoingDatatypes = (diffs, datadocument) => {

        for (let diff of diffs) {

            let { kind, path, rhs:datatype, lhs:outgoingvalue } = diff

            if (kind != 'E') {
                console.log('WARNING: unmatched outgoing datatype',diff)
                continue
            }

            if (datatype == '??timestamp' && outgoingvalue !== null) {

                let targetnode = utilities.getNodePosition(datadocument,path)
                if (!targetnode) {
                    console.error('nodepositoin not found in application.processOutgoingDataTypes',diff)
                    continue
                }

                let value = outgoingvalue
                try {
                    if (value) {
                        value =  firebase.firestore.Timestamp.fromDate(outgoingvalue)
                    }
                } catch (e) { // try to self-heal
                    value = outgoingvalue // try to convert to date through new Timestamp
                }
                targetnode.nodeproperty[targetnode.nodeindex] = value

            }

        }

        return datadocument
    }

    filterDataIncomingDocpack = ( docpack, typepack ) => {

        let newdoc = merge({}, docpack.document)

        let datadocument = newdoc

        if (typepack) {

            let datatypes = typepack.document.properties.model.datatypes

            let diffs = deepdiff(datadocument,datatypes)

            datadocument = this.processIncomingDatatypes(diffs, datadocument, docpack.document)

        }

        return {

            document:datadocument,
            reference:docpack.reference
        }

    }

    filterDataOutgoingDocpack = ( docpack, typepack ) => {

        let newdoc = merge({}, docpack.document)

        let datadocument = newdoc

        if (typepack) {

            let datatypes = typepack.document.properties.model.datatypes

            let diffs = deepdiff(datadocument,datatypes)

            datadocument = this.processOutgoingDatatypes(diffs, datadocument)

        }

        return {

            document:datadocument,
            reference:docpack.reference
        }

    }

    filterDataIncomingValue = ( value, path, type ) => {

        if (!type) return [value,undefined]

        let returnvalue = value
        let datatype

        if (type) {

            let datatypes = type.properties.model.datatypes
            let typenode = utilities.getNodePosition(datatypes,path)
            if (!typenode) {
                // nothing...
            } else {

                datatype = typenode.nodevalue

                if (datatype == '??timestamp') {

                    try {

                        returnvalue =  value.toDate()

                    } catch (e) { // try to self-heal
                        returnvalue = value // try to convert to date through new Timestamp
                        if (returnvalue.seconds !== undefined && returnvalue.nanoseconds !== undefined) {
                            returnvalue = new firebase.firestore.Timestamp(returnvalue.seconds, returnvalue.nanoseconds)
                            returnvalue = returnvalue.toDate()
                        }
                    }

                }

            }

        } else {
            console.error('no type document for ',path, value)
        }

        return [returnvalue,datatype]

    }

    filterDataOutgoingValue = ( value , path, type ) => {

        let datatype
        if (!type) {
            console.log('no type provided for outgoing value conversion: value, path, type',value, path, type)
            return [value,datatype]
        }

        let datatypes = type.properties.model.datatypes

        let nodedata = utilities.getNodePosition(datatypes,path)

        if (!nodedata) {
            console.log('datatype not found for outgoing value, path, type',value, path, type)
            return [value,datatype]
        }

        datatype = nodedata.nodevalue

        // console.log('originalnode',originalnode)
        let outgoingvalue = value

        if (datatype == '??timestamp') {
            try {
                if (outgoingvalue) {
                    outgoingvalue =  firebase.firestore.Timestamp.fromDate(outgoingvalue)
                }
            } catch (e) { // try to self-heal
                console.log('unable to convert outgoing timestamp: value, path, type',value, path, type)
            }
        }

        return [outgoingvalue,datatype]
    
    }

}

let application = {

    properties:appManager.properties,
    setSignoutCallback:appManager.setSignoutCallback,

    setDocpackPairListener:appManager.setDocpackPairListener,
    removeDocpackPairListener:appManager.removeDocpackPairListener,
    setNewDocpackPairListener:appManager.setNewDocpackPairListener,
    setDocpackListener:appManager.setDocpackListener,
    removeDocpackListener:appManager.removeDocpackListener,
    docpackIsListener:appManager.docpackIsListener,

    getDocument:appManager.getDocument,
    getNewDocument:appManager.getNewDocument,
    queryForDocument:appManager.queryForDocument,

    fontFamily:appManager.fontFamily,
    userdata:appManager.userdata,
    systemdata:appManager.systemdata,

    setDocument:appManager.setDocument,
    
    getCollection:appManager.getCollection,

    signin:appManager.signin,
    signout:appManager.signout,

    filterDataIncomingValue:appManager.filterDataIncomingValue,
    filterDataOutgoingValue:appManager.filterDataOutgoingValue,
    filterDataIncomingDocpack:appManager.filterDataIncomingDocpack,
    filterDataOutgoingDocpack:appManager.filterDataOutgoingDocpack,

}

export default application
