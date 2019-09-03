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

// application outbound messages

export interface GetDocumentMessage {
    reference:string,
    whereclauses?:any[], 
    success:Function, 
    failure:Function,
    paired?:Boolean,
}

export interface SetDocumentMessage {
    reference:string, 
    document:GenericObject, 
    success:Function, 
    failure:Function,
}

export interface GetCollectionMessage {
    reference:string, 
    whereclauses?:any[], 
    success:Function, 
    failure:Function,
}

export interface SetListenerMessage {
    doctoken:DocTokenStruc,
    instanceid:number,
    success:Function,
    failure:Function,
    newdocument?:GenericObject,
}

export interface SetNewListenerMessage {
    typereference:string,
    collection:string,
    customid?:string,
    success:Function,
    failure:Function,
}

export interface RemoveListenerMessage {
    doctoken:DocTokenStruc,
    instanceid:number,
}

// application inbound messages

export interface DocpackPayloadMessage {
    docpack:DocPackStruc,
    reason: GenericObject,
}

export interface DocpackListPayloadMessage {
    docpacklist:DocPackStruc[],
    reason: GenericObject,
}

export interface DocpackPairPayloadMessage {
    docpack:DocPackStruc,
    typepack:DocPackStruc,
    reason:GenericObject,
}

// application action calls

export interface SetGatewayListenerMessage {
    reference:string, 
    success:Function,
    failure:Function,
    paired:Boolean,
    newdocument?:GenericObject,
}

export interface RemoveGatewayListenerMessage {
    reference:string, 
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


// local

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
