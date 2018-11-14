// schemesupport.class.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence

/*
    TODO:
    - for deletions, this process should compare previous and current versions of the 
    template based on versions that are recorded in the document and 
    template.
*/

import deepdiff from 'deep-diff'
import merge from 'deepmerge'

// TODO: test current document version of type against type version
const assertType = (docpack, typepack) => {

    try {

        // make deep local copy of docpack
        let localdocpack:any = merge({},docpack)
        // unpack type data for upgrades
        let {template, defaults } = typepack.document.properties

        // get differences between template and current document
        let differences = getDiffs(
            localdocpack.document,
            template,
        )

        console.log('differences',differences)

        // upgrade document with template
        let {document, changed} = getUpgrade(localdocpack.document, differences, defaults)

        // return updgraded document
        return {
            document,
            changed,
        }

    } catch (e) {

        console.log('error in assertType',e)

    }

}

const getDiffs = (document,template) => {

    let differences = deepdiff.diff(document, template, (path, key) => {

        // test scope. if out of scope, stop comparison
        // note: this blocks out legitimate deletions, which need to be handled some other way
        let filter = false
        let templateproperty
        let templateindex
        let templatevalue = template

        for (templateindex of path) {
            templateproperty = templatevalue
            templatevalue = templateproperty[templateindex]
            if (templatevalue === undefined) { // out of scope
                filter = true
                break
            }
        }

        if (!filter) {
            templateproperty = templatevalue
            templatevalue = templateproperty[key]
            if (templatevalue === undefined) {
                filter = true
            }
        }

        return filter

    })

    return differences

}

const getUpgrade = (original, differences, defaults) => {
    let changed = false
    if (differences) {
        for (let changerecord of differences) {

            if ((changerecord.kind == 'N') || (changerecord.kind == 'D')) {

                if (!changed) changed = true

                deepdiff.applyChange(original,null,changerecord)

                if (changerecord.kind == 'N') {

                    applyNewBranchDefaults(original, changerecord, defaults)

                }

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
const applyNewBranchDefaults = (original, changerecord, defaults) => {

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

        if (defaultvalue === undefined) return

    }

    // =========[ get the document node to apply the default value to ]==========

    // get the matching original property to change to default, based on change path
    let originalproperty
    let originalindex
    let originalvalue = original
    for (originalindex of path) {

        originalproperty = originalvalue
        originalvalue = originalproperty[originalindex]

        if (originalvalue === undefined) return // no doc node available

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

        for (let changerecord of differences) {

            if (changerecord.kind == 'E') {

                deepdiff.applyChange(originalproperty, null, changerecord)

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