// schemesupport.class.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
/*
    TODO:
    - for deletions, this process should compare previous and current versions of the
    template based on versions that are recorded in the document and
    template.
*/
import deepdiff from 'deep-diff';
import merge from 'deepmerge';
// TODO: test current document version of type against type version
const assertType = (docpack, typepack) => {
    // console.log('assertType docpack, typepack', docpack, typepack)
    try {
        // make deep local copy of docpack
        let localdocpack = merge({}, docpack);
        // unpack type data for upgrades
        let { template, defaults } = typepack.document.properties;
        // get differences between template and current document
        let differences = getDiffs(localdocpack.document, template);
        // console.log('differences',differences)
        //TODO: deletions (from previous versions)
        // upgrade document with template
        let { document, changed } = getUpgrade(localdocpack.document, differences, defaults);
        //extension
        const { extension } = typepack.document.properties;
        if (extension !== undefined) {
            document.__proto__ = extension;
            // console.log('adding extension', extension, document.triggers)
        }
        // console.log('document with extension',document,typepack)
        // return updgraded document
        return {
            document,
            changed,
        };
    }
    catch (e) {
        console.log('error in assertType', e);
    }
};
const getDiffs = (document, template) => {
    let differences = deepdiff.diff(document, template, (path, key) => {
        // this item is filtered -- return true means exclude (filter); return false(ish?) means include
        // test scope. if out of scope, stop comparison
        // note: this blocks out legitimate deletions, which need to be handled some other way
        let filter = false;
        let templatetreeposition = getTreePosition(template, path);
        if (!templatetreeposition) {
            filter = true;
        }
        if (!filter) {
            let { comparandproperty: templateproperty, comparandindex: templateindex, comparandvalue: templatevalue } = templatetreeposition;
            templateproperty = templatevalue;
            templatevalue = templateproperty[key];
            if (templatevalue === undefined) {
                filter = true;
            }
        }
        return filter;
    });
    return differences;
};
const getUpgrade = (original, differences, defaults) => {
    let changed = false;
    if (differences) {
        for (let changerecord of differences) {
            if ((changerecord.kind == 'N') || (changerecord.kind == 'D')) {
                if (!changed)
                    changed = true;
                deepdiff.applyChange(original, null, changerecord);
                if (changerecord.kind == 'N') {
                    applyNewBranchDefaults(original, changerecord, defaults);
                }
            }
        }
    }
    return {
        document: original,
        changed,
    };
};
// this applies default value for each individual change
// change could involve an entire branch
const applyNewBranchDefaults = (original, changerecord, defaults) => {
    // =========[ get the default value to apply ]==========
    // get the path of the value to change
    let path = changerecord.path;
    let defaulttreeposition = getTreePosition(original, path);
    if (!defaulttreeposition)
        return;
    let { comparandproperty: defaultproperty, comparandindex: defaultlindex, comparandvalue: defaultvalue, } = defaulttreeposition;
    // =========[ get the document node to apply the default value to ]==========
    // get the matching original property to change to default, based on change path
    let comparandtreeposition = getTreePosition(original, path);
    if (!comparandtreeposition)
        return;
    let { comparandproperty: sourceproperty, comparandindex: sourceindex, comparandvalue: sourcevalue, } = comparandtreeposition;
    // =================[ apply the default value to the document node ]=============
    if (isObject(defaultvalue)) { // a branch of defaults is available
        let defaultproperty = defaultvalue; // better name
        sourceproperty = sourcevalue;
        if (!isObject(sourceproperty)) {
            console.log('error: mismatch of property and defualts', original, defaults, sourceproperty, defaultproperty);
            return;
        }
        let differences = getDiffs(sourceproperty, defaultproperty);
        for (let changerecord of differences) {
            if (changerecord.kind == 'E') {
                deepdiff.applyChange(sourceproperty, null, changerecord);
            }
        }
    }
    else { // a default value is available
        sourceproperty[sourceindex] = defaultvalue;
    }
};
const getTreePosition = (comparand, path) => {
    let comparandproperty;
    let comparandindex;
    let comparandvalue = comparand;
    for (comparandindex of path) {
        comparandproperty = comparandvalue;
        comparandvalue = comparandproperty[comparandindex];
        if (comparandvalue === undefined)
            return undefined; // no doc node available
    } // yields comparandproperty and comparandindex of that property
    return {
        comparandproperty,
        comparandindex,
        comparandvalue,
    };
};
// ========================[ utilities ]========================
const isObject = value => {
    return ((typeof value === 'object') && (value !== null));
};
// =========================[ export ]==========================
const schemesupport = {
    assertType,
};
export default schemesupport;
//# sourceMappingURL=schemesupport.jsx.map