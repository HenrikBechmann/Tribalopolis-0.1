// domain.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence

/****************************************************************************

    This is a multi-proged hook for business logic filters

    No content yet, just pass-through

****************************************************************************/

'use strict'

import gateway from './gateway'
import { GetDocumentInterface, GetNewDocumentInterface, QueryCollectionInterface, SetDocumentInterface } from './interfaces'

const setDocumentListener = (reference, processDocumentCallbackFromGateway) => {

    gateway.setDocumentListener(reference, processDocumentCallbackFromGateway)

}

const removeDocumentListener =  (reference) => {

    gateway.removeDocumentListener(reference)

}

const getDocument = ({reference, callback, errorback}:GetDocumentInterface) => {

    let parm:GetDocumentInterface = {reference, callback, errorback}
    gateway.getDocument(parm)

}

const getNewDocument = ({reference, callback, errorback}:GetNewDocumentInterface) => {

    let parm:GetNewDocumentInterface = {reference, callback, errorback}
    gateway.getNewDocument(parm)

}

const queryCollection = ({reference, whereclauses, success, failure}:QueryCollectionInterface) => {

    let parm:QueryCollectionInterface = {reference, whereclauses, success, failure}
    gateway.queryCollection(parm)

}

const setDocument = ({reference, data, success, failure}:SetDocumentInterface) => {

    let parm:SetDocumentInterface = {reference, data, success, failure} 
    gateway.setDocument(parm)

}

const getCollection = ({reference, success, failure}) => {

    gateway.getCollection({reference,success,failure})
    
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