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

// posting messages
export interface PostFormMessage {
    formcontext:GenericObject,
    success:Function,
    failure:Function,
}

export interface SetFormMessage {

}

export interface RegisterFormMessage {

}

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

export interface DataPaneMessage {
    docproxy:GenericObject,
    options:GenericObject,
    callbacks:GenericCallbacks,
    registercalldowns?:Function,
}

// same as DataPaneNamespace
export interface FactoryNamespace {
    docpack:DocPackStruc,
    typepack:DocPackStruc,
    options:GenericObject,
    docproxy:GenericObject,
    controller:ControllerData,
    // local?:GenericObject,
}

export interface FactoryMessage {
    renderdata:GenericObject,
    namespace:GenericObject,
}

export interface ControllerData {
    userdata:GenericObject,
    systemdata:GenericObject,
    callbacks:GenericCallbacks,
    registercalldowns?:Function,
}

// local

export interface GenericCallbacks {
    [name:string]:Function,
}

export interface GenericObject {
    [name:string]:any,
}

// same as GetFactoryMessage
export interface DataPaneNamespace {
    controller:ControllerData,
    docpack:GenericObject,
    typepack:GenericObject,
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
