// interfaces.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
/*

*/

'use strict'

/***************************************************************
interfaces for session data transfer objects
***************************************************************/

// services

export interface GetDocumentInterface {
    reference:string,
    callback:Function, 
    errorback:Function,
}

export interface GetNewDocumentInterface {
    reference:string,
    callback:Function, 
    errorback:Function,
}

export interface QueryForDocumentInterface {
    reference:string, 
    whereclauses:Array<any>, 
    success:Function, 
    failure:Function,
}

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

// session objects

export interface DocPackInterface {
    id:string,
    document:Object,
}

export interface DocTokenInterface {
    reference:string,
}

export interface DocProxyInterface {
    doctoken:DocTokenInterface,
    liststack?:Array<any>
}
