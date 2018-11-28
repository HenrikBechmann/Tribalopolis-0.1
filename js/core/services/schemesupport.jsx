// schemesupport.class.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
/*
    TODO:
    - program transfer function; must succeed if deletions is implemented
    - automatic set of deletion list (compare type versions)
*/
'use strict';
import deepdiff from 'deep-diff';
import merge from 'deepmerge';
import utilities from '../utilities/utilities';
// TODO: test current document version of type against type version
const assertType = (docpack, typepack) => {
    if (!docpack || !typepack)
        return;
    // console.log('assertType docpack, typepack', docpack, typepack)
    try {
        // make deep local copy of docpack
        let localdocpack = merge({}, docpack);
        // unpack type data for upgrades
        let { template, defaults, deletions } = typepack.document.properties;
        //TODO: deletions (from previous versions)
        let { document: localdoc } = localdocpack;
        // console.log('localdoc',localdoc)
        let { version: doctypeversion } = localdoc.identity.type;
        let { version: typeversion } = typepack.document.identity;
        // console.log('doctypeversion, typeversion',doctypeversion,typeversion)
        let deletionsperformed = false;
        if ((doctypeversion === typeversion) && (typeversion !== null)) {
            // check for deletions
            let deletions = typepack.document.properties.deletions.versions[doctypeversion];
            if (deletions) {
                let paths = deletions.map((value) => {
                    let path = value.split('.');
                    return path;
                });
                // console.log('deletions to perform',deletions,paths)
                for (let path of paths) {
                    let nodePosition = utilities.getNodePosition(localdocpack.document, path);
                    if (nodePosition) {
                        let { nodeproperty, nodeindex } = nodePosition;
                        delete nodeproperty[nodeindex];
                        if (!deletionsperformed)
                            deletionsperformed = true;
                        // console.log('deleted comparandproperty, comparandindex',localdocpack.document,nodeproperty,nodeindex)
                    }
                }
            }
        }
        // get differences between template and current document
        let differences = getDiffs(localdocpack.document, template);
        // upgrade document with template
        let { document, changed: datachanged } = getUpgrade(localdocpack.document, differences, defaults);
        let extensionadded = false;
        //extension
        // const { extension } = typepack.document.properties
        // if (extension !== undefined) {
        //     document.__proto__ = extension
        //     extensionadded = true
        // }
        // console.log('document with extension',document,typepack)
        datachanged = (datachanged || deletionsperformed);
        // return updgraded document
        return {
            document,
            changed: datachanged,
            extended: extensionadded,
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
        let templatenodeposition = utilities.getNodePosition(template, path);
        if (!templatenodeposition) {
            filter = true;
        }
        if (!filter) {
            let { nodeproperty: templateproperty, nodeindex: templateindex, nodevalue: templatevalue } = templatenodeposition;
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
    // console.log('getUpgrade original, differences',original,differences)
    let changed = false;
    if (differences) {
        for (let changerecord of differences) {
            if ((changerecord.kind == 'N') || (changerecord.kind == 'E')) {
                // console.log('changerecord',changerecord)
                if (changerecord.kind == 'E') {
                    if (!utilities.isObject(changerecord.rhs)) {
                        // if (isObject(changerecord.lhs)) {
                        continue;
                        // }
                    }
                }
                if (!changed)
                    changed = true;
                // console.log('applying change')
                deepdiff.applyChange(original, null, changerecord);
                if (changerecord.kind == 'N') {
                    // console.log('applying new change record',original, changerecord, defaults)
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
    // console.log('applyNewBranchDefaults original, changerecord, defaults',original, changerecord, defaults)
    // get the path of the value to change
    let path = changerecord.path;
    let defaultnodeposition = utilities.getNodePosition(defaults, path);
    if (!defaultnodeposition)
        return;
    let { nodeproperty: defaultproperty, nodeindex: defaultlindex, nodevalue: defaultvalue, } = defaultnodeposition;
    // =========[ get the document node to apply the default value to ]==========
    // get the matching original property to change to default, based on change path
    let comparandnodeposition = utilities.getNodePosition(original, path);
    if (!comparandnodeposition)
        return;
    let { nodeproperty: sourceproperty, nodeindex: sourceindex, nodevalue: sourcevalue, } = comparandnodeposition;
    // =================[ apply the default value to the document node ]=============
    if (utilities.isObject(defaultvalue)) { // a branch of defaults is available
        let defaultproperty = defaultvalue; // better name
        sourceproperty = sourcevalue;
        if (!utilities.isObject(sourceproperty)) {
            console.log('error: mismatch of property and defaults', original, defaults, sourceproperty, defaultproperty);
            return;
        }
        let differences = getDiffs(sourceproperty, defaultproperty);
        if (differences) {
            for (let changerecord of differences) {
                if (changerecord.kind == 'E') {
                    deepdiff.applyChange(sourceproperty, null, changerecord);
                }
            }
        }
    }
    else { // a default value is available
        sourceproperty[sourceindex] = defaultvalue;
    }
};
// =========================[ export ]==========================
const schemesupport = {
    assertType,
};
export default schemesupport;
//# sourceMappingURL=schemesupport.jsx.map