// domain.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
/****************************************************************************

    This is a multi-proged hook for business logic filters

    No content yet, just pass-through

****************************************************************************/
'use strict';
import gateway from './gateway';
const setDocumentListener = (reference, processDocumentCallbackFromGateway) => {
    gateway.setDocumentListener(reference, processDocumentCallbackFromGateway);
};
const removeDocumentListener = (reference) => {
    gateway.removeDocumentListener(reference);
};
const getDocument = (parmblock) => {
    gateway.getDocument(parmblock);
};
const getNewDocument = (parmblock) => {
    gateway.getNewDocument(parmblock);
};
const queryCollection = (parmblock) => {
    gateway.queryCollection(parmblock);
};
const setDocument = (parmblock) => {
    gateway.setDocument(parmblock);
};
const getCollection = (parmblock) => {
    gateway.getCollection(parmblock);
};
let domain = {
    setDocumentListener,
    removeDocumentListener,
    getDocument,
    getNewDocument,
    queryCollection,
    setDocument,
    getCollection,
};
export default domain;
//# sourceMappingURL=domain.jsx.map