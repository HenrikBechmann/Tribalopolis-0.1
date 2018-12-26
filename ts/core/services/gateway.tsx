// domain.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later
/*
    This is a gateway to the underlaying domain data
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
import { schemes, localtypes, items, lists, links, folders, accounts } from '../../data/repositories'

import firebase from './firebase.api'
import { 
    GetDocumentMessage, 
    SetDocumentMessage, 
    GetCollectionMessage, 
    DocPackStruc,
    ReturnDocPackMessage,
    RemoveGatewayListenerMessage,
} from './interfaces'

let firestore = firebase.firestore()

const setGatewayListener = (parmblock:GetDocumentMessage) => {
    let data

    let {reference, success, failure} = parmblock

    console.log('setGatewayListener', parmblock)

    if (!reference) {

        data = null

    } else {

        let refsplit = reference.split('/')
        let collection = refsplit[1]

        switch (collection) {
            case 'types':
            case 'accounts':
            case 'users':
            case 'system': {

                console.log('refsplit, collection in setGatewayListener',refsplit,collection)

                getSnapshot(parmblock)
                // console.log('return from callkng getSnapshot')
                return

            }
        }

        let id = refsplit[2]
        if (collection == 'lists')
            data = lists[id]
        else if (collection == 'items')
            data = items[id]
        else if (collection == 'localtypes')
            data = localtypes[id]
        else {
            throw 'unrecognized collection: ' + collection
            data = null
        }

    }
    // setTimeout(()=>{
        let parms:ReturnDocPackMessage = {docpack:{reference,document:data}, reason:{}}
        success(parms)
        // setTimeout(()=>{
        //     callback(reference, data, {})
        // },15)
    // },1000)
}

const snapshotUnsubscribes = {}

const getSnapshot = (parmblock:GetDocumentMessage) => {

    let {reference, success, failure} = parmblock

    if (snapshotUnsubscribes[reference]) {

        throw 'Error: ' + reference + ' is already subscribed'

    }

    // console.log('getSnapshot',parmblock)

    let docref = firestore.doc(reference)
    snapshotUnsubscribes[reference] = docref.onSnapshot(doc => {

        let docpack:DocPackStruc = {
            document:doc.data(),
            reference,
        }
        let msg:ReturnDocPackMessage = {
            docpack,
            reason:{}
        }

        // console.log('return getSnapshot',msg)
        success(msg)

    })
}

const removeGatewayListener = ({reference}:RemoveGatewayListenerMessage) => {

    let refsplit = reference.split('/')
    let collection = refsplit[1]

    switch (collection) {
        case 'types':
        case 'accounts':
        case 'users':
        case 'system': {

            console.log('removing system listener', reference)

            snapshotUnsubscribes[reference]()
            delete snapshotUnsubscribes[reference]

        }
    }
}

const getDocument = ({reference, success, failure}:GetDocumentMessage) => {

    let docref = firestore.doc(reference)
    // console.log('gateway getting document',reference, docref)
    docref.get()
    .then((doc)=>{
        // console.log('returning doc with callback',doc.data())
        let data = doc.data()
        // let id = doc.id
        let returnpack:ReturnDocPackMessage = {docpack:{document:data,reference},reason:{}}
        success(returnpack)

    })
    .catch((error)=> {

        if (failure) failure(error)

    })
    
}

const getNewDocument = ({reference, success, failure}:GetDocumentMessage) => {
    // console.log('getting document',reference)
    let docref = firestore.collection(reference).doc()
    docref.get()
    .then((doc)=>{
        // console.log('returning doc with callback')
        let document = doc.data()
        let id = doc.id
        let docpack:DocPackStruc = {document,reference:reference + '/' + id}
        let returnpack:ReturnDocPackMessage = {docpack, reason:{}}
        success(returnpack)
    })
    .catch((error)=> {
        failure(error)
    })
}

const queryForDocument = ({reference, whereclauses, success, failure}:GetDocumentMessage) => {

    if ((!whereclauses) || (whereclauses.length == 0)) {
        failure('no where clauses defined for query')
        return // nothing to do
    }

    let collection = firestore.collection(reference)
    for (let whereclause of whereclauses) {
        collection.where(whereclause[0],whereclause[1],whereclause[2])
    }
    collection.get().then((querySnapshot)=>{
        if (querySnapshot.empty) return []
        let docs:DocPackStruc[] = []
        querySnapshot.forEach(dbdocpack => {
            let doc:DocPackStruc = {
                reference:'/' + reference + '/' + dbdocpack.id,
                // id:document.id,
                document:dbdocpack.data()
            }
            docs.push(doc)
        })
        let docpack:DocPackStruc = docs[0]
        return docpack
    }).then((docpackreturn) => {
        let docpack:DocPackStruc = docpackreturn as DocPackStruc
        let returnpack:ReturnDocPackMessage = {docpack,reason:{}}
        success(returnpack)
    }).catch(error =>{
        failure(error)
    }) 
}

const setDocument = ({reference, document, success, failure}:SetDocumentMessage) => {
    let doc = firestore.doc(reference)
    doc.set(document)
    .then(()=>{
        success()
    })
    .catch( error => failure( error ) )
}

const getCollection = ({reference, success, failure}:GetCollectionMessage) => {
    let query = firestore.collection(reference)
    query.get()
    .then(querySnapshot => {
        if (querySnapshot.empty) {
            return []
        } else {
            let result:DocPackStruc[] = []
            querySnapshot.forEach(document => {
                let doc:DocPackStruc = {
                    reference:'/' + reference + '/' + document.id,
                    document:document.data()
                }
                result.push(doc)
            })
            return result
        }
    })
    .then(docpacklist => {
        success(docpacklist) // DocPackStruc[]
    }) 
    .catch(error => failure(error))
}

let domain = {
    // get
    getDocument,
    getNewDocument,
    queryForDocument,
    getCollection,
    // get asynchronousely, including triggered updates
    setGatewayListener,
    removeGatewayListener,
    // write
    setDocument,

}

export default domain