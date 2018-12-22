// copyright (c) 2018 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import initialstate from './local/initialstate'


let theme = (state = initialstate.theme) => {
    return state
}

let colors = (state = initialstate.colors) => {
    return state
}

// ---------------------[ ui core services reducers ]------------------------

let globalbar = (state: any = {}) => {
    return state
}

// ---------------------[ home grid reducers ]------------------------

let homepage = (state:any = {}) => {
    return state
}

let pagetargets = (state: any = {}) => {
    return state
}

let coredata = 
    { 
        // system data
        theme:theme(),
        colors:colors(),
        // router, // import

        // page model
        homepage:homepage(),

        pagetargets:pagetargets(),

        // global ui management
        global:globalbar(),
    }

export default coredata
