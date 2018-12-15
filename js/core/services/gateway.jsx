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
import { types, items, lists } from '../../data/repositories';
import firebase from './firebase.api';
let firestore = firebase.firestore();
const setGatewayListener = ({ reference, callback }) => {
    let data;
    if (!reference) {
        data = null;
    }
    else {
        let refsplit = reference.split('/');
        let collection = refsplit[1];
        let id = refsplit[2];
        if (collection == 'lists')
            data = lists[id];
        else if (collection == 'items')
            data = items[id];
        else if (collection == 'types')
            data = types[id];
        else {
            console.error('unrecognized collection', collection);
            data = null;
        }
    }
    // setTimeout(()=>{
    callback(reference, data, {});
    // setTimeout(()=>{
    //     callback(reference, data, {})
    // },15)
    // },1000)
};
const removeGatewayListener = ({ reference }) => {
};
const getDocument = ({ reference, callback, errorback }) => {
    let docref = firestore.doc(reference);
    // console.log('gateway getting document',reference, docref)
    docref.get()
        .then((doc) => {
        // console.log('returning doc with callback',doc.data())
        let data = doc.data();
        let id = doc.id;
        callback(data, id);
    })
        .catch((error) => {
        errorback(error);
    });
};
const getNewDocument = ({ reference, callback, errorback }) => {
    // console.log('getting document',reference)
    let docref = firestore.collection(reference).doc();
    docref.get()
        .then((doc) => {
        // console.log('returning doc with callback')
        let data = doc.data();
        let id = doc.id;
        callback(data, id);
    })
        .catch((error) => {
        errorback(error);
    });
};
const queryForDocument = ({ reference, whereclauses, success, failure }) => {
    if ((!whereclauses) || (whereclauses.length == 0)) {
        failure('no where clauses defined for query');
        return; // nothing to do
    }
    let collection = firestore.collection(reference);
    for (let whereclause of whereclauses) {
        collection.where(whereclause[0], whereclause[1], whereclause[2]);
    }
    collection.get().then((querySnapshot) => {
        if (querySnapshot.empty)
            return [];
        let docs = [];
        querySnapshot.forEach(document => {
            let doc = {
                id: document.id,
                data: document.data()
            };
            docs.push(doc);
        });
        return docs;
    }).then((docs) => {
        success(docs);
    }).catch(error => {
        failure(error);
    });
};
const setDocument = ({ reference, data, success, failure }) => {
    let doc = firestore.doc(reference);
    doc.set(data)
        .then(() => {
        success();
    })
        .catch((error) => failure(error));
};
const getCollection = ({ reference, success, failure }) => {
    let query = firestore.collection(reference);
    query.get()
        .then(querySnapshot => {
        if (querySnapshot.empty) {
            return [];
        }
        else {
            let result = [];
            querySnapshot.forEach(document => {
                let doc = {
                    id: document.id,
                    data: document.data()
                };
                result.push(doc);
            });
            return result;
        }
    })
        .then(queryData => {
        success(queryData);
    })
        .catch(error => failure(error));
};
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
};
export default domain;
//# sourceMappingURL=gateway.jsx.map