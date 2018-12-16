// interfaces.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
/*

*/

'use strict'

/***************************************************************
interfaces for session data transfer objects
***************************************************************/

/***************************************************************
------------------------[ OPERATIONS ]--------------------------
***************************************************************/

// fetch services s/b Message

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

// change persistent data s/b Message

export interface SetDocumentMessage {
    reference:string, 
    data:Object, 
    success:Function, 
    failure:Function,
}

/***************************************************************
-------------------------[ PAYLOADS ]---------------------------
***************************************************************/

// session objects s/b struc

export interface DocTokenStruc {
    reference:string,
}

export interface DocProxyStruc {
    doctoken:DocTokenStruc,
    liststack?:any[]
}

export interface DocPackStruc {
    id:string,
    document:Object,
}
