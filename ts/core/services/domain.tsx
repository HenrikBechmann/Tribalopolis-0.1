// domain.tsx
/*
    This is a gateway to the underlaying domain data
    It is accessed by services

    The pattern is to return a new promise, wait for 
    firestore promies, then coerce the result into standard application
    format.

    if there is an error generate application error

    application promise is then resolved at endpoint

    firebase promises are fetched based on database DOCUMENT TOKENS
*/

// temporary for transiition
import { schemes, types, items, lists, links, folders, accounts } from '../../data/repositories'

import firebase from './firebase.api'

let firestore = firebase.firestore()

const setItemListener = (token) => {
    return items[token.uid]
}

const setListListener = (token) => {
    return lists[token.uid]
}

    // TODO: should always return an object
const setTypeListener = (token) => {
    return types[token.uid]
}

const getLink = (token) => {
    return links[token.uid]
}

const getScheme = (token) => {
    return schemes[token.uid]
}

const getFolder = (token) => {
    return folders[token.uid]
}

const getAccount = (token) => {
    return accounts[token.uid]
}

let domain = {
    setItemListener,
    setListListener,
    setTypeListener,
    getLink,
    getScheme,
    getFolder,
    getAccount,
}

export default domain