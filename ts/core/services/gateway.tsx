// domain.tsx
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

const setDocumentListener = (reference) => {

    let refsplit = reference.split('/')
    let token = {collection:refsplit[1],id:refsplit[2]}
    if (token.collection == 'lists')
        return lists[token.id]
    else if (token.collection == 'items')
        return items[token.id]
    else if (token.collection == 'types')
        return types[token.id]
    else {
        console.error('unrecognized collection',token)
        return null
    }
}

let domain = {
    setDocumentListener,
}

export default domain