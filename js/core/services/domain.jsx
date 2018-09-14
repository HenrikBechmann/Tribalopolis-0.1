// domain.tsx
/*
    This is a gateway to the underlaying domain data
    It is accessed by services
*/
// temporary for transiition
import { schemes, types, items, lists, links, folders, accounts } from '../../data/repositories';
import firebase from './firebase.api';
let firestore = firebase.firestore();
const getItem = (dataref) => {
    return items[dataref.uid];
};
const getList = (dataref) => {
    return lists[dataref.uid];
};
// TODO: should always return an object
const getType = (dataref) => {
    return types[dataref.uid];
};
const getLink = (dataref) => {
    return links[dataref.uid];
};
const getScheme = (dataref) => {
    return schemes[dataref.uid];
};
const getFolder = (dataref) => {
    return folders[dataref.uid];
};
const getAccount = (dataref) => {
    return accounts[dataref.uid];
};
let domain = {
    getItem,
    getList,
    getType,
    getLink,
    getScheme,
    getFolder,
    getAccount,
};
export default domain;
//# sourceMappingURL=domain.jsx.map