// domain.tsx
/*
    This is a gateway to the underlaying domain data
    It is accessed by services

    The pattern is to return a new promise, wait for 
    firestore promies, then coerce the result into standard application
    format.

    if there is an error generate application error

    application promise is then resolved at endpoint

    firebase promises are fetched based on database TOKENS
*/

// temporary for transiition
import { schemes, types, items, lists, links, folders, accounts } from '../../data/repositories'

import firebase from './firebase.api'

let firestore = firebase.firestore()

const getItem = (datatoken) => {
    return items[datatoken.uid]
}

const getList = (datatoken) => {
    return lists[datatoken.uid]
}

    // TODO: should always return an object
const getType = (datatoken) => {
    return types[datatoken.uid]
}

const getLink = (datatoken) => {
    return links[datatoken.uid]
}

const getScheme = (datatoken) => {
    return schemes[datatoken.uid]
}

const getFolder = (datatoken) => {
    return folders[datatoken.uid]
}

const getAccount = (datatoken) => {
    return accounts[datatoken.uid]
}

let domain = {
    getItem,
    getList,
    getType,
    getLink,
    getScheme,
    getFolder,
    getAccount,
}

export default domain