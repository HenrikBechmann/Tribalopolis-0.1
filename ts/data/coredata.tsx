// copyright (c) 2016 Henrik Bechmann, Toronto, MIT Licence
// reducers.tsx

// TODO: co-locate selectors here: get...(...)

'use strict'

// import { combineReducers } from 'redux'
// import { handleActions } from 'redux-actions'; // handleAction doesn't work with combineReducers
// import { routerReducer as router} from 'react-router-redux'
// import {reducer as toastr} from 'react-redux-toastr'

import initialstate from './local/initialstate'
// -------------[ app resources ]---------------
// import * as Actions from './actions'

// import masterModel from "../../legacy/budgetpedia.model"

// ----------[ app settings ]----------------------
// import explorer from '../../addons/explorer/reducers'
// -----------[ system resource reducers ]------------

let theme = (state = initialstate.theme) => {
    return state
}

// let system = (state:any = masterModel.system) => {
//     return state
// }

let colors = (state = initialstate.colors) => {
    return state
}

// let resources = combineReducers({
//     theme,
//     colors,
// })

// ---------------------[ ui core services reducers ]------------------------

let globalbar = (state: any = {}) => {
    return state
}

// let global = combineReducers({
//     globalbar,
// })

// ---------------------[ home grid reducers ]------------------------

let homepage = (state:any = {}) => {
    return state
}

let pagetargets = (state: any = {}) => {
    return state
}

// let pages = combineReducers({
//     homepage,
//     pagetargets,
// })

// ---------------------------[ main reducer ]--------------------------------

let coredata = 
    { 
        // system data
        theme:theme(),
        colors:colors(),
        // router, // import

        // page model
        homepage:homepage(),

        pagetargets:pagetargets(),

        // toastr,

        // global ui management
        global:globalbar(),
    }

export default coredata
