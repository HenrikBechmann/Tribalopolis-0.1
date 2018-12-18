// interfaces.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
/*

*/

'use strict'

/***************************************************************
interfaces for session data transfer objects
Message: a data structure specifying an action
Struc: as data structure specifying an object/document
***************************************************************/

/***************************************************************
------------------------[ OPERATIONS ]--------------------------
***************************************************************/

// fetch copy of persistent documents

export interface GetDocumentMessage {
    reference:string,
    whereclauses?:any[], 
    success:Function, 
    failure:Function,
}

export interface GetCollectionMessage {
    reference:string, 
    whereclauses?:any[], 
    success:Function, 
    failure:Function,
}

export interface ReturnDocPackMessage {
    docpack:DocPackStruc,
    reason: Object,
}

// subscriptions to application

export interface SetPairListenerMessage {
    doctoken:DocTokenStruc,
    instanceid:number,
    success:Function,
    failure:Function,
}

export interface RemovePairListenerMessage {
    doctoken:DocTokenStruc,
    instanceid:number,
}

export interface ReturnDocPairMessage {
    docpack:DocPackStruc,
    typepack:DocPackStruc,
    reason:Object,
}

// subscriptions to gateway

// uses ReturnDocPackMessage for return

export interface SetGatewayListenerMessage {
    reference:string, 
    success:Function,
    failure:Function,
}

export interface RemoveGatewayListenerMessage {
    reference:string, 
}

// change persistent data

export interface SetDocumentMessage {
    reference:string, 
    document:Object, 
    success:Function, 
    failure:Function,
}

/***************************************************************
-------------------------[ PAYLOADS ]---------------------------
***************************************************************/

// session objects

export interface DocTokenStruc {
    reference:string,
}

export interface DocProxyStruc {
    doctoken:DocTokenStruc,
    liststack?:any[]
}

export interface DocPackStruc {
    reference:string,
    document:{
        [index:string]:any
    },
}

export interface CacheItemStruc {
    docpack:DocPackStruc,
    listeners:Map<string,any>
}
