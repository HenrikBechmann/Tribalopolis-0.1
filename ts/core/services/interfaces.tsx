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

export interface GetCollectionInterface {
    reference:string, 
    success:Function, 
    failure:Function,
}

export interface SetDocumentListenerInterface {
    doctoken:DocTokenInterface,
    instanceid:number,
    success:Function,
    failure:Function,
}

export interface RemoveDocumentListenerInterface {
    doctoken:DocTokenInterface,
    instanceid:number,
}

export interface SetGatewayListenerInterface {
    reference:string, 
    success:Function,
    failure:Function,
}

export interface RemoveGatewayListenerInterface {
    reference:string, 
}

// change persistent data s/b Message

export interface SetDocumentInterface {
    reference:string, 
    data:Object, 
    success:Function, 
    failure:Function,
}

/***************************************************************
-------------------------[ PAYLOADS ]---------------------------
***************************************************************/

// session objects s/b struc

export interface DocTokenInterface {
    reference:string,
}

export interface DocProxyInterface {
    doctoken:DocTokenInterface,
    liststack?:any[]
}

export interface DocPackInterface {
    id:string,
    document:Object,
}
