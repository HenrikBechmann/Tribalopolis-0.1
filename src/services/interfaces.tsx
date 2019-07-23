// interfaces.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later
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
    paired?:Boolean,
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

export interface ReturnDocPairMessage {
    docpack:DocPackStruc,
    typepack:DocPackStruc,
    reason:GenericObject,
}

// subscriptions to gateway

// uses ReturnDocPackMessage for return

export interface SetGatewayListenerMessage {
    reference:string, 
    success:Function,
    failure:Function,
    paired:Boolean,
}

export interface RemoveGatewayListenerMessage {
    reference:string, 
}

// change persistent data

export interface SetDocumentMessage {
    reference:string, 
    document:GenericObject, 
    success:Function, 
    failure:Function,
}

// ui

export interface DataPaneContext {
    docproxy:GenericObject,
    options:GenericObject,
    callbacks:GenericCallbacks,
}

export interface GetPreRenderContext {
    docpack:DocPackStruc,
    typepack:DocPackStruc,
    options:GenericObject,
    container:ContainerData,
}

export interface PreRenderContext {
    renderspecs:GenericObject,
    namespace:GenericObject,
    docref:string,
}

export interface ContainerData {
    userdata:GenericObject,
    props:GenericObject,
    callbacks:GenericCallbacks,
}

interface GenericCallbacks {
    [name:string]:Function,
}

interface GenericObject {
    [name:string]:any,
}

export interface DataPaneNamespace {
    container:ContainerData,
    document:GenericObject,
    props:GenericObject,
    type:GenericObject,
    functions:GenericObject,
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
    document:GenericObject,
}

export interface CacheItemStruc {
    docpack:DocPackStruc,
    listeners:Map<string,any>
}
