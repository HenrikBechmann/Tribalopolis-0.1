// copyright (c) 2016 Henrik Bechmann, Toronto, MIT Licence
// reducers.tsx
// TODO: co-locate selectors here: get...(...)
'use strict';
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import { reducer as toastr } from 'react-redux-toastr';
import initialstate from '../local/initialstate';
// -------------[ app resources ]---------------
// import * as Actions from './actions'
// import masterModel from "../../legacy/budgetpedia.model"
// ----------[ app settings ]----------------------
// import explorer from '../../addons/explorer/reducers'
// -----------[ system resource reducers ]------------
let theme = (state = initialstate.theme) => {
    return state;
};
// let system = (state:any = masterModel.system) => {
//     return state
// }
let colors = (state = initialstate.colors) => {
    return state;
};
let resources = combineReducers({
    theme,
    colors,
});
// ---------------------[ ui core services reducers ]------------------------
let globalbar = (state = {}, action) => {
    return state;
};
let global = combineReducers({
    globalbar,
});
// ---------------------[ home grid reducers ]------------------------
let homepage = (state = {}, action) => {
    return state;
};
let pagetargets = (state = {}, action) => {
    return state;
};
let pages = combineReducers({
    homepage,
    pagetargets,
});
// ---------------------------[ main reducer ]--------------------------------
let mainReducerCore = {
    // system data
    resources,
    router,
    // page model
    pages,
    toastr,
    // global ui management
    global,
};
export default mainReducerCore;
//# sourceMappingURL=reducers.jsx.map