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

// fetch services

export interface GetDocumentMessage {
    reference:string,
    successfunc?:Function, 
    failurefunc?:Function,
    whereclauses?:Array<any>, 
}

// listeners

export interface SetDocumentListenerInterface {
    doctoken:DocTokenInterface,
    instanceid:number,
    successfunc:Function,
    failurefunc:Function,
}

export interface RemoveDocumentListenerInterface {
    doctoken:DocTokenInterface,
    instanceid:number,
}

export interface SetGatewayListenerInterface {
    reference:string, 
    successfunc:Function,
    failurefunc:Function,
}

export interface RemoveGatewayListenerInterface {
    reference:string, 
}

// change persistent data

export interface SetDocumentInterface {
    reference:string, 
    data:Object, 
    successfunc:Function, 
    failurefunc:Function,
}

export interface GetCollectionInterface {
    reference:string, 
    successfunc:Function, 
    failurefunc:Function,
}

/***************************************************************
-------------------------[ PAYLOADS ]---------------------------
***************************************************************/

// session objects

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
