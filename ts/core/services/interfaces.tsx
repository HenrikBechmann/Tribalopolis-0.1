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

// fetch persistent data

export interface GetDocumentMessage {
    reference:string,
    whereclauses?:any[], 
    success:Function, 
    failure:Function,
}

export interface GetCollectionMessage {
    reference:string, 
    success:Function, 
    failure:Function,
}

// subscriptions

export interface SetListenerMessage {
    doctoken:DocTokenStruc,
    instanceid:number,
    success:Function,
    failure:Function,
}

export interface RemoveListenerMessage {
    doctoken:DocTokenStruc,
    instanceid:number,
}

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
    data:Object, 
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
    document:Object,
}

export interface ReturnDocPackStruc {
    docpack:DocPackStruc,
    reason: Object,
}

export interface ReturnDocPairStruc {
    docpack:DocPackStruc,
    typepack:DocPackStruc,
    reason:Object,
}

export interface CacheItemStruc {
    docpack:DocPackStruc,
    listeners:Map<string,any>
}
