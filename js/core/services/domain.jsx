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
import { schemes, types, items, lists, links, folders, accounts } from '../../data/repositories';
import firebase from './firebase.api';
let firestore = firebase.firestore();
const setItemListener = (doctoken) => {
    return items[doctoken.uid];
};
const setListListener = (doctoken) => {
    return lists[doctoken.uid];
};
// TODO: should always return an object
const setTypeListener = (doctoken) => {
    return types[doctoken.uid];
};
const getLink = (doctoken) => {
    return links[doctoken.uid];
};
const getScheme = (doctoken) => {
    return schemes[doctoken.uid];
};
const getFolder = (doctoken) => {
    return folders[doctoken.uid];
};
const getAccount = (doctoken) => {
    return accounts[doctoken.uid];
};
let domain = {
    setItemListener,
    setListListener,
    setTypeListener,
    getLink,
    getScheme,
    getFolder,
    getAccount,
};
export default domain;
//# sourceMappingURL=domain.jsx.map