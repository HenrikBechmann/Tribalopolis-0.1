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
    QueryForDocumentInterface, 
    SetDocumentInterface, 
    GetCollectionInterface,
    SetGatewayListenerInterface,
    RemoveGatewayListenerInterface
} from './interfaces'

const setDocumentListener = ({reference, callback:processDocumentCallbackFromGateway}:SetGatewayListenerInterface) => {

    gateway.setGatewayListener({reference, callback:processDocumentCallbackFromGateway})

}

const removeDocumentListener =  (reference) => {

    let parm:RemoveGatewayListenerInterface = {reference}
    gateway.removeGatewayListener(parm)

}

const getDocument = (parmblock:GetDocumentInterface) => {

    gateway.getDocument(parmblock)

}

const getNewDocument = (parmblock:GetNewDocumentInterface) => {

    gateway.getNewDocument(parmblock)

}

const queryForDocument = (parmblock:QueryForDocumentInterface) => {

    gateway.queryForDocument(parmblock)

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
    queryForDocument,
    setDocument,
    getCollection,
}

export default domain