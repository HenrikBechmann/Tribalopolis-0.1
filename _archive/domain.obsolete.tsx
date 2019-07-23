// domain.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

/****************************************************************************

    This is a multi-proged hook for business logic filters

    No content yet, just pass-through

****************************************************************************/

'use strict'

import gateway from './gateway'
import { 
    GetDocumentMessage, 
    SetDocumentMessage, 
    GetCollectionMessage,
    SetGatewayListenerMessage,
    RemoveGatewayListenerMessage
} from './interfaces'

const noop = () => {

}

const setDocumentListener = (parmblock:SetGatewayListenerMessage) => {

    gateway.setDocumentListener(parmblock)

}

const removeDocumentListener =  (parmblock:RemoveGatewayListenerMessage) => {

    gateway.removeDocumentListener(parmblock)

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
    setDocumentListener,
    removeDocumentListener,
    getDocument,
    getNewDocument,
    queryForDocument,
    setDocument,
    getCollection,
}

export default domain