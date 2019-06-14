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

import domain from './domain'
import { 
    GetDocumentMessage, 
    SetDocumentMessage, 
    GetCollectionMessage,
    SetListenerMessage,
    RemoveListenerMessage,
    ReturnDocPackMessage,
    ReturnDocPairMessage,
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

export const sentinels = {}

// =================[ API ]=======================

const appManager = new class {

    properties = {

        ismobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

    }


    private fontFamilyMemo = null

    private userdataMemo = null
    private systemdataMemo = null

    // =================[ PRIVATE ]=======================

    private updateSetSentinel = instanceid => {

        let sentinel = 
            sentinels[instanceid]
            ?sentinels[instanceid][0]
            :undefined

        if (sentinel === undefined) { // create listener

            sentinels[instanceid]=[false] // allow continuation with set listener

        } else if (sentinel === true) { // stop was set; clear sentinal; abandon

            sentinels[instanceid].shift()

            if (sentinels[instanceid].length === 0) {

                delete sentinels[instanceid]

            }

            return

        } else { // sentinel = false; continue with set listener

            sentinels[instanceid].push(false)   

        }

    }

    private updateRemoveSentinel = instanceid => {

        let sentinel = 
            sentinels[instanceid]
            ?sentinels[instanceid][0]
            :undefined

        if (sentinel === undefined) { // create sentinal; set before listener

            sentinels[instanceid]=[true]

            return

        } else if (sentinel === false) { // clear sentinal; continue delete listener

            sentinels[instanceid].shift()

            if (sentinels[instanceid].length === 0) {

                delete sentinels[instanceid]
            }

        } else { // sentinal === true; was set for previous call; queue next

            sentinels[instanceid].push(true)

            return
        }

    }

    // =================[ API ]=======================
    // called from component componentDidMount or componentWillUpdate

    setDocpackListener = ({doctoken,instanceid,success, failure}:SetListenerMessage) => {

        setTimeout(()=>{ // give animations a chance to run

            let reference = doctoken.reference // getTokenReference(doctoken)

            this.updateSetSentinel(instanceid)

            docpackCache.addListener(reference,instanceid,success)

            let docpack:DocPackStruc = docpackCache.getCacheDocpack(reference)

            if (docpack) { // defer if waiting for docpack

                let parmblock:ReturnDocPackMessage = {
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

    setDocpackPairListener = ({doctoken,instanceid,success, failure}:SetListenerMessage) => {

        setTimeout(()=>{ // give animations a chance to run

            let reference = doctoken.reference // getTokenReference(doctoken)

            this.updateSetSentinel(instanceid)

            docpackCache.addListener(reference,instanceid,success)

            let cachedata = docpackCache.getCacheDocpackPair(reference)

            if (cachedata.docpack && cachedata.typepack) { // defer if waiting for type
                let docpack:DocPackStruc = cachedata.docpack

                let parmblock:ReturnDocPairMessage = {
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

        this.updateRemoveSentinel(instanceid)

        docpackCache.removeListener(reference,instanceid)

    }

    // called from component componentWillUnmount
    removeDocpackPairListener = ({doctoken, instanceid}:RemoveListenerMessage) => {

        let reference = doctoken.reference

        this.updateRemoveSentinel(instanceid)

        docpackCache.removeListener(reference,instanceid)

        // console.log('removed DocpackPairListener', docpackCache)

    }

    getDocument = (parmblock:GetDocumentMessage) => {

        domain.getDocument(parmblock)

    }

    getNewDocument = (parmblock:GetDocumentMessage) => {

        domain.getNewDocument(parmblock)

    }

    queryForDocument = (parmblock:GetDocumentMessage) => {

        domain.queryForDocument(parmblock)
        
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

        domain.setDocument(parmblock)

    }

    getCollection = (parmblock:GetCollectionMessage) => {

        domain.getCollection(parmblock)
        
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
            // console.log('completing signout')
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
                // console.log('datadocument, originaldocument',datadocument, originaldocument)
                let originalnode = utilities.getNodePosition(originaldocument,path)
                if (!originalnode) {
                    console.error('nodepositoin not found in application.processIncomingDataTypes',diff)
                    continue
                }
                // console.log('originalnode',originalnode)
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
                // console.log('transformed incoming timestamp value',datadocument, datanode, value)
            }

        }

        return datadocument
    }

    private processOutgoingDatatypes = (diffs, datadocument) => {

        // console.log('processOutgoingDatatypes: diff, datadocument',diffs, datadocument)

        for (let diff of diffs) {

            let { kind, path, rhs:datatype, lhs:outgoingvalue } = diff

            if (kind != 'E') {
                console.log('WARNING: unmatched outgoing datatype',diff)
                continue
            }

            if (datatype == '??timestamp' && outgoingvalue !== null) {
                // console.log('datadocument, originaldocument',datadocument, originaldocument)
                let targetnode = utilities.getNodePosition(datadocument,path)
                if (!targetnode) {
                    console.error('nodepositoin not found in application.processOutgoingDataTypes',diff)
                    continue
                }
                // console.log('originalnode',originalnode)
                let value = outgoingvalue
                try {
                    if (value) {
                        value =  firebase.firestore.Timestamp.fromDate(outgoingvalue)
                    }
                } catch (e) { // try to self-heal
                    value = outgoingvalue // try to convert to date through new Timestamp
                }
                targetnode.nodeproperty[targetnode.nodeindex] = value
                // console.log('transformed incoming timestamp value',datadocument, datanode, value)
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

        // console.log('diffs in filterDataIncomingDocument',datadocument, datatypes, diffs)

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

        // console.log('diffs in filterDataIncomingDocument',datadocument, datatypes, diffs)

        return {

            document:datadocument,
            reference:docpack.reference
        }

    }

    filterDataIncomingValue = ( value, path, type ) => {
        console.log('filterDataIncomingValue',value, path, type)

        if (!type) return value

        let returnvalue = value

        if (type) {

            let datatypes = type.properties.model.datatypes
            let typenode = utilities.getNodePosition(datatypes,path)
            if (!typenode) {
                console.log('warning: no type node for ',path, type, value)
            } else {
                let datatype = typenode.nodevalue
                if (datatype == '$$timestamp') {

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

        return returnvalue

    }

    filterDataOutgoingValue = ( value , path, type ) => {
        console.log('filterDataOutgoingValue',value, path, type)

        if (!type) return value

        return value
    
    }

}

let application = {

    properties:appManager.properties,
    setSignoutCallback:appManager.setSignoutCallback,

    setDocpackPairListener:appManager.setDocpackPairListener,
    removeDocpackPairListener:appManager.removeDocpackPairListener,
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
