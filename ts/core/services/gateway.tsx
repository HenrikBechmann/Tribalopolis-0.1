// domain.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
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

// temporary for transiition
import { schemes, types, items, lists, links, folders, accounts } from '../../data/repositories'

import firebase from './firebase.api'
import { 
    GetDocumentInterface, 
    GetNewDocumentInterface, 
    QueryForDocumentInterface, 
    SetDocumentInterface, 
    GetCollectionInterface 
} from './interfaces'

let firestore = firebase.firestore()

const setGatewayListener = ({reference,callback}) => {
    let data

    if (!reference) {

        data = null

    } else {

        let refsplit = reference.split('/')
        let collection = refsplit[1]
        let id = refsplit[2]
        if (collection == 'lists')
            data = lists[id]
        else if (collection == 'items')
            data = items[id]
        else if (collection == 'types')
            data = types[id]
        else {
            console.error('unrecognized collection',collection)
            data = null
        }

    }
    // setTimeout(()=>{
        callback(reference, data, {})
        // setTimeout(()=>{
        //     callback(reference, data, {})
        // },15)
    // },1000)
}

const removeGatewayListener = ({reference}) => {

}

const getDocument = ({reference, successfunc, failurefunc}:GetDocumentInterface) => {

    let docref = firestore.doc(reference)
    // console.log('gateway getting document',reference, docref)
    docref.get()
    .then((doc)=>{
        // console.log('returning doc with callback',doc.data())
        let data = doc.data()
        let id = doc.id
        successfunc(data,id)

    })
    .catch((error)=> {

        failurefunc(error)

    })
    
}

const getNewDocument = ({reference, successfunc, failurefunc}:GetNewDocumentInterface) => {
    // console.log('getting document',reference)
    let docref = firestore.collection(reference).doc()
    docref.get()
    .then((doc)=>{
        // console.log('returning doc with callback')
        let data = doc.data()
        let id = doc.id
        successfunc(data,id)
    })
    .catch((error)=> {
        failurefunc(error)
    })
}

const queryForDocument = ({reference, whereclauses, successfunc, failurefunc}:QueryForDocumentInterface) => {

    if ((!whereclauses) || (whereclauses.length == 0)) {
        failurefunc('no where clauses defined for query')
        return // nothing to do
    }

    let collection = firestore.collection(reference)
    for (let whereclause of whereclauses) {
        collection.where(whereclause[0],whereclause[1],whereclause[2])
    }
    collection.get().then((querySnapshot)=>{
        if (querySnapshot.empty) return []
        let docs = []
        querySnapshot.forEach(document => {
            let doc = {
                id:document.id,
                data:document.data()
            }
            docs.push(doc)
        })
        return docs
    }).then((docs) => {
        successfunc(docs)
    }).catch(error =>{
        failurefunc(error)
    }) 
}

const setDocument = ({reference, data, successfunc, failurefunc}:SetDocumentInterface) => {
    let doc = firestore.doc(reference)
    doc.set(data)
    .then(()=>{
        successfunc()
    })
    .catch((error)=>failurefunc(error))
}

const getCollection = ({reference, successfunc, failurefunc}:GetCollectionInterface) => {
    let query = firestore.collection(reference)
    query.get()
    .then(querySnapshot => {
        if (querySnapshot.empty) {
            return []
        } else {
            let result = []
            querySnapshot.forEach(document => {
                let doc = {
                    id:document.id,
                    data:document.data()
                }
                result.push(doc)
            })
            return result
        }
    })
    .then(queryData => {
        successfunc(queryData)
    }) 
    .catch(error => failurefunc(error))
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