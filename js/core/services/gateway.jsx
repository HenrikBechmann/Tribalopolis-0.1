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
import { types, items, lists } from '../../data/repositories';
import firebase from './firebase.api';
let firestore = firebase.firestore();
const setDocumentListener = (reference, callback) => {
    let data;
    if (!reference) {
        data = null;
    }
    else {
        let refsplit = reference.split('/');
        let token = { collection: refsplit[1], id: refsplit[2] };
        if (token.collection == 'lists')
            data = lists[token.id];
        else if (token.collection == 'items')
            data = items[token.id];
        else if (token.collection == 'types')
            data = types[token.id];
        else {
            console.error('unrecognized collection', token);
            data = null;
        }
    }
    // setTimeout(()=>{
    callback(reference, data, {});
    // },1000)
};
const removeDocumentListener = reference => {
};
let domain = {
    setDocumentListener,
    removeDocumentListener,
};
export default domain;
//# sourceMappingURL=gateway.jsx.map