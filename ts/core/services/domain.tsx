// domain.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence

/****************************************************************************

    This is a multi-proged hook for business logic filters

    No content yet, just pass-through

****************************************************************************/

'use strict'

import gateway from './gateway'
import { 
    GetDocumentInterface, 
    GetNewDocumentInterface, 
    QueryCollectionInterface, 
    SetDocumentInterface, 
    GetCollectionInterface 
} from './interfaces'

const setDocumentListener = (reference, processDocumentCallbackFromGateway) => {

    gateway.setDocumentListener(reference, processDocumentCallbackFromGateway)

}

const removeDocumentListener =  (reference) => {

    gateway.removeDocumentListener(reference)

}

const getDocument = (parmblock:GetDocumentInterface) => {

    gateway.getDocument(parmblock)

}

const getNewDocument = (parmblock:GetNewDocumentInterface) => {

    gateway.getNewDocument(parmblock)

}

const queryCollection = (parmblock:QueryCollectionInterface) => {

    gateway.queryCollection(parmblock)

}

const setDocument = (parmblock:SetDocumentInterface) => {

    gateway.setDocument(parmblock)

}

const getCollection = (parmblock:GetCollectionInterface) => {

    gateway.getCollection(parmblock)
    
}


let domain = {
    setDocumentListener,
    removeDocumentListener,
    getDocument,
    getNewDocument,
    queryCollection,
    setDocument,
    getCollection,
}

export default domain