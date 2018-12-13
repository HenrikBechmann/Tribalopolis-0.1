// interfaces.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
/*

*/

'use strict'

/***************************************************************
interfaces for session data transfer objects
***************************************************************/

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

}

export interface GetCollectionInterface {

}
