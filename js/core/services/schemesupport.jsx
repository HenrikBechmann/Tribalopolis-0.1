// schemesupport.class.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
import deepdiff from 'deep-diff';
import merge from 'deepmerge';
// TODO: test current document version of type against type version
const assertType = (docpack, typepack) => {
    // make deep copy of docpack
    let localdocpack = merge({}, docpack);
    // unpack type data
    let { structure, defaults, constraints, template } = typepack.document.properties;
    // get differences between template and current document
    let differences = getDiffs(localdocpack.document, template);
    // upgrade document with template
    let { document, changed } = getUpgrade(localdocpack.document, differences, defaults);
    // return updgraded document
    return {
        document,
        changed,
    };
};
const getDiffs = (document, template) => {
    let differences = deepdiff.diff(document, template);
    return differences;
};
const getUpgrade = (original, differences, defaults) => {
    let changed = false;
    for (let changerecord of differences) {
        if ((changerecord.kind == 'N') || (changerecord.kind == 'D')) {
            if (!changed)
                changed = true;
            deepdiff.applyChange(original, null, changerecord);
            if (changerecord.kind == 'N') {
                original = applyDefault(original, changerecord, defaults);
                // apply defaults
            }
        }
    }
    return {
        document: original,
        changed,
    };
};
const isObject = value => {
    return ((typeof value === 'object') && (value !== null));
};
// TODO: deal with deletion
// apply default value for each individual change
// this could involve an entire branch
const applyDefault = (original, changerecord, defaults) => {
    // =========[ get the default value to apply ]==========
    // get the path of the value to change
    let path = changerecord.path;
    // get the default value to set
    let defaultvalue = defaults;
    for (let defaultindex of path) {
        defaultvalue = defaultvalue[defaultindex];
        if (defaultvalue === undefined) {
            break;
        }
    }
    if (defaultvalue === undefined) { // no default value for the change; return
        return original;
    }
    // =========[ get the document node to apply the default value to ]==========
    // get the matching original property to change to default, based on change path
    let originalproperty = original;
    let originalindex; // next index
    let originalnext; // lookahead
    for (originalindex of path) {
        originalnext = originalproperty[originalindex];
        if (originalnext === undefined) { // defensive; shouldn't happen
            originalproperty = originalnext;
            break;
        }
        if (isObject(originalnext)) { // continue to iterate
            originalproperty = originalnext; // the most common case
        }
        else { // originalproperty[originalindex] === value
            break;
        }
    } // yields originalproperty and originalindex of that property
    if (originalproperty === undefined) { // TODO: error! should never happen
        console.log('error: change record path not found in original', changerecord);
        return original;
    }
    // =================[ apply the default value to the document node ]=============
    if (isObject(defaultvalue)) { // a branch of defaults is available
        let defaultproperty = defaultvalue; // better name!
        let differences = getDiffs(originalproperty, defaultproperty);
        for (let difference of differences) {
            if ((difference.kind == 'E') || (difference.kind == 'A')) { // TODO: test and review the 'A' case
                deepdiff.applyChange(originalproperty, null, difference);
            }
        }
    }
    else { // a default value is available
        originalproperty[originalindex] = defaultvalue;
    }
    return original;
};
const schemesupport = {
    assertType,
};
export default schemesupport;
//# sourceMappingURL=schemesupport.jsx.map