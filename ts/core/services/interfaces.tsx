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

export interface QueryCollectionInterface {
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

// session objects

export interface DocTokenInterface {
    reference:string,
}

export interface DocProxyInterface {
    doctoken:DocTokenInterface,
    liststack?:Array<any>
}

export interface DocPackInterface {
    id:string,
    document:Object,
}
