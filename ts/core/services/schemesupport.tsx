// schemesupport.class.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence

import deepdiff from 'deep-diff'
import merge from 'deepmerge'

// TODO: test current document version of type against type version
const assertType = (docpack, typepack) => {

    // console.log('assertType',docpack, typepack)
    let localdocpack:any = merge({},docpack)
    let {structure, defaults, constraints, template} = typepack.document.properties
    // console.log('structure, defaults, contraints',structure, defaults, constraints, template, localdocpack)
    let differences = getDiffs(
        localdocpack.document,
        template,
    )
    // console.log('differences',differences)
    let {document, changed} = getUpgrade(localdocpack.document, differences, defaults)
    // console.log('differences, upgrade', differences, document)
    return {
        document,
        changed,
    }
}

const getDiffs = (document,template) => {
    let differences = deepdiff.diff(document,template)
    return differences
}

const getUpgrade = (original, differences, defaults) => {
    let changed = false
    for (let changerecord of differences) {
        if ((changerecord.kind == 'N') || (changerecord.kind == 'D') ) {

            // !changed && console.log('defaults',defaults)
            if (!changed) changed = true

            deepdiff.applyChange(original,null,changerecord)
            if (changerecord.kind == 'N') {
                original = applyDefault(original, changerecord, defaults)
                // apply defaults
            }

        }
    }
    return {
        document:original,
        changed,
    }
}

const isObject = value => {
    return ((typeof value === 'object') && (value !== null))
}
// apply default value to individual change
// this could involve an entire subtree
const applyDefault = (original, changerecord, defaults) => {
    // console.log('applyDefault original, changerecord, defaults',original, changerecord, defaults)

    // get the path of the value to change
    let path = changerecord.path
    // get the default value to set
    let defaultvalue = defaults
    for (let defaultindex of path) {
        defaultvalue = defaultvalue[defaultindex]
        if (defaultvalue === undefined) {
            break
        }
    }
    if (defaultvalue === undefined) { // no default value for the change; return
        return original 
    }

    // get the matching original property to change to default, based on change path
    let originalproperty = original
    let originalindex // next index
    let originalnext // lookahead
    for (originalindex of path) {
        originalnext = originalproperty[originalindex]
        if (originalnext === undefined) { // defensive; shouldn't happen
            originalproperty = originalnext
            break
        }
        if (isObject(originalnext)) { // continue to iterate
            originalproperty = originalnext
        } else {
            // originalproperty[originalindex] == value
            break
        }
    } // yields original property and originalindex of that property

    if (originalproperty === undefined) { // TODO: error! should never happen
        console.log('error: change record path not found in original',changerecord)
        return original
    }

    let originalvalue = originalproperty[originalindex]

    if (isObject(defaultvalue)) {
        let defaultproperty = defaultvalue
        // console.log('defaultValue object: originalproperty, originalindex, defaultvalue',originalproperty, defaultproperty)
        let diffs = getDiffs(originalproperty,defaultproperty)
        // console.log('diffs',diffs)
        for (let diff of diffs) {
            if ((diff.kind == 'E') || (diff.kind == 'A')) {
                deepdiff.applyChange(originalproperty, null, diff)
            }
        }
    } else {
        originalproperty[originalindex] = defaultvalue
    }

    return original
}

const schemesupport = {
    assertType,
}

export default schemesupport