// domain.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence

/****************************************************************************

    This is a multi-proged hook for business logic filters

    No content yet, just pass-through

****************************************************************************/

'use strict'

import gateway from './gateway'
import { 
    GetDocumentMessage, 
    // GetNewDocumentInterface, 
    // QueryForDocumentInterface, 
    SetDocumentMessage, 
    GetCollectionMessage,
    SetGatewayListenerMessage,
    RemoveGatewayListenerMessage
} from './interfaces'

const noop = () => {

}

const setDocumentPairListener = (parmblock:SetGatewayListenerMessage) => {

    gateway.setGatewayListener(parmblock)

}

const removeDocumentPairListener =  (parmblock:RemoveGatewayListenerMessage) => {

    gateway.removeGatewayListener(parmblock)

}

const getDocument = (parmblock:GetDocumentMessage) => {

    gateway.getDocument(parmblock)

}

const getNewDocument = (parmblock:GetDocumentMessage) => {

    gateway.getNewDocument(parmblock)

}

const queryForDocument = (parmblock:GetDocumentMessage) => {

    gateway.queryForDocument(parmblock)

}

const setDocument = (parmblock:SetDocumentMessage) => {

    gateway.setDocument(parmblock)

}

const getCollection = (parmblock:GetCollectionMessage) => {

    gateway.getCollection(parmblock)
    
}


let domain = {
    setDocumentPairListener,
    removeDocumentPairListener,
    getDocument,
    getNewDocument,
    queryForDocument,
    setDocument,
    getCollection,
}

export default domain