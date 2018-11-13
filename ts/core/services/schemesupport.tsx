// schemesupport.class.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence

import deepdiff from 'deep-diff'
import merge from 'deepmerge'

// TODO: test current document version of type against type version
const assertType = (docpack, typepack) => {

    // make deep local copy of docpack
    let localdocpack:any = merge({},docpack)
    // unpack type data for upgrades
    let {template, defaults } = typepack.document.properties

    // get differences between template and current document
    let differences = getDiffs(
        localdocpack.document,
        template,
    )

    // upgrade document with template
    let {document, changed} = getUpgrade(localdocpack.document, differences, defaults)

    // return updgraded document
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

            if (!changed) changed = true

            deepdiff.applyChange(original,null,changerecord)

            if (changerecord.kind == 'N') {

                applyNewDefaults(original, changerecord, defaults)

            }

        }
    }
    return {
        document:original,
        changed,
    }
}

// this applies default value for each individual change
// change could involve an entire branch
const applyNewDefaults = (original, changerecord, defaults) => {

    // =========[ get the default value to apply ]==========

    // get the path of the value to change
    let path = changerecord.path

    // get the default value to set
    let defaultproperty
    let defaultindex
    let defaultvalue = defaults
    for (defaultindex of path) {
        defaultproperty = defaultvalue
        defaultvalue = defaultproperty[defaultindex]
        if (defaultproperty === undefined) {
            break
        }
    }
    if (defaultvalue === undefined) { // no default value for the change; return
        return 
    }

    // =========[ get the document node to apply the default value to ]==========

    // get the matching original property to change to default, based on change path
    let originalproperty
    let originalindex
    let originalvalue = original
    for (originalindex of path) {

        originalproperty = originalvalue

        originalvalue = originalproperty[originalindex]


    } // yields originalproperty and originalindex of that property

    // =================[ apply the default value to the document node ]=============

    if (isObject(defaultvalue)) { // a branch of defaults is available

        let defaultproperty = defaultvalue // better name

        originalproperty = originalvalue

        if (!isObject(originalproperty)) {
            console.log('error: mismatch of property and defualts',
                original, defaults, originalproperty, defaultproperty)
            return
        }

        let differences = getDiffs(originalproperty,defaultproperty)

        for (let difference of differences) {

            if (difference.kind == 'E') {

                deepdiff.applyChange(originalproperty, null, difference)

            }

        }

    } else { // a default value is available

        originalproperty[originalindex] = defaultvalue

    }

}

// ========================[ utilities ]========================

const isObject = value => {
    return ((typeof value === 'object') && (value !== null))
}

// =========================[ export ]==========================

const schemesupport = {
    assertType,
}

export default schemesupport