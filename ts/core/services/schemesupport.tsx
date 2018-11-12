// schemesupport.class.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence

import deepdiff from 'deep-diff'
import merge from 'deepmerge'

// TODO: test current document version of type against type version
const assertType = (docpack, typepack) => {

    console.log('assertType',docpack, typepack)
    let localdocpack:any = merge({},docpack)
    let {structure, defaults, constraints, template} = typepack.document.properties
    // console.log('structure, defaults, contraints',structure, defaults, constraints, template, localdocpack)
    let differences = getDiffs(
        localdocpack.document,
        template,
    )
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

            !changed && console.log('defaults',defaults)
            if (!changed) changed = true

            deepdiff.applyChange(original,null,changerecord)
            if (changerecord.kind == 'N') {
                console.log('changerecord',changerecord)
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

    // get the original property to change to default
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
        console.log('todo: apply defaultvalue',defaultvalue)
        // let objectcontainer = defaultvalue
        // let objectvalue
        // let objectindex
        // for (objectindex in objectcontainer) {
        //     objectvalue = objectcontainer[objectindex]
        // }
        // console.log('deeper defaults: defaultobject, defaultindex, value, parentvar, parentindex',objectcontainer, objectindex, objectvalue, parentvar, parentindex)
    } else {
        originalproperty[originalindex] = defaultvalue
        console.log('applying default:originalproperty, originalindex, originalvalue, defaultvalue',originalproperty,originalindex,originalvalue,defaultvalue)
    }

    return original
}

const schemesupport = {
    assertType,
}

export default schemesupport