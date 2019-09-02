// gateway.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later
/*
    This is a gateway to the underlying domain data
    It is accessed by services

    The pattern is to return a new promise, wait for 
    firestore promises, then coerce the result into standard application
    format.

    if there is an error generate application error

    application promise is then resolved at endpoint

    firebase promises are fetched based on database DOCUMENT TOKENS
*/

'use strict'

// temporary for transiition
import { schemes, localtypes, items, lists, links, folders, accounts } from '../data/repositories'

import firebase from './firebase.api'
import { 
    GetDocumentMessage, 
    SetDocumentMessage, 
    GetCollectionMessage, 

    DocpackPayloadMessage,
    DocpackListPayloadMessage,
    RemoveGatewayListenerMessage,

    DocPackStruc,
} from './interfaces'

import application from './application'

let firestore = firebase.firestore()

const setDocumentListener = (parmblock:GetDocumentMessage) => {
    let data

    console.log('gatway setDocumentListener parmblock',parmblock)

    let {reference, success, failure, paired} = parmblock

    if (!reference) {

        data = null

    } else {

        let refsplit = reference.split('/')
        let collection 
        if (reference[0] == '/')
            collection = refsplit[1]
        else
            collection = refsplit[0]

        switch (collection) {
            case 'pages':
            // case 'datapanes':
            case 'layouts':
            case 'types':
            case 'accounts':
            case 'organization':
            case 'members':
            case 'users':
            case 'userclaims':
            case 'system': {

                getSnapshot(parmblock)

                return

            }
        }

        // ** TEMPORARY LOCAL CACHE OF DEMO DATA **
//=============================
        let id
        if (reference[0] == '/') {
            id = refsplit[2]
        }
        else {
            id = refsplit[1]
        }

        if (!id) data = id // undefined or null

        switch (collection) {

            case 'lists':
                data = lists[id]
                break
            case 'items':
                data = items[id]
                break
            case 'localtypes':
                data = localtypes[id]
                break
            default: {
                console.log('ERROR: unrecognized collection', collection, parmblock)
                throw 'unrecognized collection: ' + collection
                data = null
            }

        }
    }

    let payload:DocpackPayloadMessage = {
        docpack:{
            reference,
            document:data
        }, 
        reason:{
            sourceparms:parmblock
        }
    }

    if (!payload.docpack.document) {

        if (failure) {

            failure(
                'data not found - gateway local cache',
                {reference,sourcparms:parmblock}
            )

        } else {

            throw 'setDocumentListener failure but no failure callback'
            console.log('setDocumentListener failure but no failure callback',parmblock)

        }

    } else {

        success(payload)

    }
}

const snapshotUnsubscribes = {}

const getSnapshot = (parmblock:GetDocumentMessage) => {

    // console.log('getting snapshot in gateway',parmblock)

    let {reference, success, failure} = parmblock

    if (snapshotUnsubscribes[reference]) {

        throw 'Error: ' + reference + ' is already subscribed'

    }

    let docref = firestore.doc(reference)
    snapshotUnsubscribes[reference] = docref.onSnapshot(doc => {

        let docpack:DocPackStruc = {
            document:doc.data(),
            reference,
        }
        let payload:DocpackPayloadMessage = {
            docpack,
            reason:{sourceparms:parmblock}
        }

        console.log('calling success in getSnapshot',payload)

        success(payload)

    },(error) => {
        if (failure) {
            failure(error, {reference,sourceparms:parmblock})
        } else {
            throw `gateway error: unable to fetch ${reference}; no failure callback`
        }
    })
}

const removeDocumentListener = ({reference}:RemoveGatewayListenerMessage) => {

    let refsplit = reference.split('/')
        let collection 
        if (reference[0] == '/')
            collection = refsplit[1]
        else
            collection = refsplit[0]

    switch (collection) {
        case 'pages':
        case 'layouts':
        case 'types':
        case 'accounts':
        case 'organization':
        case 'members':
        case 'users':
        case 'userclaims':
        case 'system': {

            snapshotUnsubscribes[reference] && snapshotUnsubscribes[reference]()
            snapshotUnsubscribes[reference] && delete snapshotUnsubscribes[reference]

        }
    }
}

const getDocument = (parmblock:GetDocumentMessage) => {

    let {reference, success, failure} = parmblock

    let docref = firestore.doc(reference)

    docref.get()
    .then((doc)=>{
        let data = doc.data()

        let payload:DocpackPayloadMessage = {docpack:{document:data,reference},reason:{sourceparms:parmblock}}
        success(payload)

    })
    .catch((error)=> {

        if (failure) {
            failure(error, {reference,sourceparms:parmblock})
        } else {
            throw `gateway error: unable to getDocument ${reference}; no failure callback`
        }

    })
    
}

const getNewDocument = (parmblock:GetDocumentMessage) => {

    let {reference, success, failure} = parmblock

    let docref = firestore.collection(reference).doc()
    docref.get()
    .then((doc)=>{

        let document = doc.data()
        let id = doc.id
        let docpack:DocPackStruc = {
            document,
            reference:reference + '/' + id
        }
        let payload:DocpackPayloadMessage = {
            docpack, 
            reason:{
                sourceparms:parmblock
            }
        }
        success(payload)
    })
    .catch((error)=> {
        if (failure) {
            failure(error, {sourceparms:parmblock})
        } else {
            throw `gateway error: unable to getNewDocument ${reference}; no failure callback`
        }
    })
}

const getNewDocumentRef = (parmblock) => {
    let { collection } = parmblock
    return firestore.collection(collection).doc()
}

const queryForDocument = (parmblock:GetDocumentMessage) => {

    let {reference, whereclauses, success, failure} = parmblock

    if ((!whereclauses) || (whereclauses.length == 0)) {
        if (failure) {

            failure('no where clauses defined for query', {reference,whereclauses, sourceparms:parmblock})
        } else {
            throw `gateway error: unable to queryForDocument (no whereclauses) ${reference}; no failure callback`
        }
        return // nothing to do
    }

    let collection = firestore.collection(reference)

    let query:any = collection
    for (let whereclause of whereclauses) {

        query = query.where(whereclause[0],whereclause[1],whereclause[2])

    }

    query.get().then((querySnapshot)=>{

        if (querySnapshot.empty) {
            throw Error('query failed')
        }

        let docs:DocPackStruc[] = []
        querySnapshot.forEach(dbdocpack => {
            let doc:DocPackStruc = {
                reference:reference + '/' + dbdocpack.id,
                // id:document.id,
                document:dbdocpack.data()
            }
            docs.push(doc)
        })

        let docpack:DocPackStruc = docs[0]

        return docpack

    }).then((docpackreturn) => {

        let docpack:DocPackStruc = docpackreturn as DocPackStruc
        let payload:DocpackPayloadMessage = {docpack,reason:{sourceparms:parmblock}}

        success(payload)

    }).catch(error =>{

        if (failure) {
            failure(error,{reference, whereclauses, sourceparms:parmblock})
        } else {
            throw `gateway error: unable to queryForDocument ${reference}; no failure callback`
        }

    }) 
}

const setDocument = (parmblock:SetDocumentMessage) => {
    let {reference, document, success, failure} = parmblock
    let doc = firestore.doc(reference)
    doc.set(document)
    .then(()=>{
        let payload:DocpackPayloadMessage = {docpack:null,reason:{sourceparms:parmblock}}
        success(payload)
    })
    .catch( error => {
        if (failure) {
            failure( error, {reference, document,sourceparms:parmblock} )
        } else {
            throw `gateway error: unable to setDocument ${reference}; no failure callback`
        }
    })
}

const getCollection = (parmblock:GetCollectionMessage) => {
    let {reference, success, failure} = parmblock
    let query = firestore.collection(reference)
    query.get()
    .then(querySnapshot => {
        if (querySnapshot.empty) {
            return []
        } else {
            let result:DocPackStruc[] = []
            querySnapshot.forEach(document => {
                let doc:DocPackStruc = {
                    reference:reference + '/' + document.id,
                    document:document.data()
                }
                result.push(doc)
            })
            return result
        }
    })
    .then(docpacklist => {
        let payload:DocpackListPayloadMessage = {docpacklist, reason:{sourceparms:parmblock}}
        success(payload)
    }) 
    .catch(error => {
        if (failure) {
            failure(error, {reference,sourceparms:parmblock})
        } else {
            throw `gateway error: unable to getCollection ${reference}; no failure callback`
        }
    })
}

let gateway = {
    // get
    getDocument,
    getNewDocument,
    getNewDocumentRef,
    queryForDocument,
    getCollection,
    // get asynchronousely, including triggered updates
    setDocumentListener,
    removeDocumentListener,
    // write
    setDocument,

}

export default gateway