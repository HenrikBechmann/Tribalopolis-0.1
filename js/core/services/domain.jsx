// domain.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
/****************************************************************************

    This is a multi-proged hook for business logic filters

    No content yet, just pass-through

****************************************************************************/
'use strict';
import gateway from './gateway';
const noop = () => {
};
const setDocumentPairListener = (parmblock) => {
    gateway.setGatewayListener(parmblock);
};
const removeDocumentPairListener = (parmblock) => {
    gateway.removeGatewayListener(parmblock);
};
const getDocument = (parmblock) => {
    gateway.getDocument(parmblock);
};
const getNewDocument = (parmblock) => {
    gateway.getNewDocument(parmblock);
};
const queryForDocument = (parmblock) => {
    gateway.queryForDocument(parmblock);
};
const setDocument = (parmblock) => {
    gateway.setDocument(parmblock);
};
const getCollection = (parmblock) => {
    gateway.getCollection(parmblock);
};
let domain = {
    setDocumentPairListener,
    removeDocumentPairListener,
    getDocument,
    getNewDocument,
    queryForDocument,
    setDocument,
    getCollection,
};
export default domain;
//# sourceMappingURL=domain.jsx.map