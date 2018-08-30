// copyright (c) 2016 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import initialstate from './local/initialstate';
let theme = (state = initialstate.theme) => {
    return state;
};
let colors = (state = initialstate.colors) => {
    return state;
};
// ---------------------[ ui core services reducers ]------------------------
let globalbar = (state = {}) => {
    return state;
};
// ---------------------[ home grid reducers ]------------------------
let homepage = (state = {}) => {
    return state;
};
let pagetargets = (state = {}) => {
    return state;
};
let coredata = {
    // system data
    theme: theme(),
    colors: colors(),
    // router, // import
    // page model
    homepage: homepage(),
    pagetargets: pagetargets(),
    // global ui management
    global: globalbar(),
};
export default coredata;
//# sourceMappingURL=coredata.jsx.map