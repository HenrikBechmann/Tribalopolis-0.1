// interfaces.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
/*

*/

'use strict'

/***************************************************************
interfaces for session data transfer objects
***************************************************************/

// fetch services

export interface GetDocumentInterface {
    reference:string,
    success:Function, 
    failure:Function,
}

export interface GetNewDocumentInterface {
    reference:string,
    success:Function, 
    failure:Function,
}

export interface QueryForDocumentInterface {
    reference:string, 
    whereclauses:Array<any>, 
    success:Function, 
    failure:Function,
}

// listeners

export interface SetDocumentListenerInterface {
    doctoken:DocTokenInterface,
    instanceid:number,
    callback:Function,
}

export interface RemoveDocumentListenerInterface {
    doctoken:DocTokenInterface,
    instanceid:number,
}

export interface SetGatewayListenerInterface {
    reference:string, 
    callback:Function,
}

export interface RemoveGatewayListenerInterface {
    reference:string, 
}

// change persistent data

export interface SetDocumentInterface {
    reference:string, 
    data:Object, 
    success:Function, 
    failure:Function,
}

export interface GetCollectionInterface {
    reference:string, 
    success:Function, 
    failure:Function,
}

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
