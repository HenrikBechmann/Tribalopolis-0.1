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

let firestore = firebase.firestore()

const setDocumentListener = (reference,callback) => {
    let data
    if (!reference) {
        data = null
    } else {
        let refsplit = reference.split('/')
        let token = {collection:refsplit[1],id:refsplit[2]}
        if (token.collection == 'lists')
            data = lists[token.id]
        else if (token.collection == 'items')
            data = items[token.id]
        else if (token.collection == 'types')
            data = types[token.id]
        else {
            console.error('unrecognized collection',token)
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

const removeDocumentListener = reference => {

}

const getDocument = (reference, callback, errorback) => {
    // console.log('getting document',reference)
    let docref = firestore.doc(reference)
    docref.get()
    .then((doc)=>{
        // console.log('returning doc with callback')
        let data = doc.data()
        let id = doc.id
        callback(data,id)
    })
    .catch((error)=> {
        errorback(error)
    })
}

const setDocument = (reference, data, success, failure) => {
    let doc = firestore.doc(reference)
    doc.set(data)
    .then(()=>{
        success()
    })
    .catch((error)=>failure(error))
}

const getCollection = (reference, success, failure) => {
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
        success(queryData)
    }) 
    .catch(error => failure(error))
}

let domain = {
    setDocumentListener,
    removeDocumentListener,
    getDocument,
    setDocument,
    getCollection,
}

export default domain