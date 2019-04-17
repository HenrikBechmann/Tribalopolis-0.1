// schemesupport.class.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

/*
    TODO: 
    - program transfer function; must succeed if deletions is implemented
    - automatic set of deletion list (compare type versions)
*/

'use strict'

import deepdiff from 'deep-diff'
import merge from 'deepmerge'

import utilities from '../utilities/utilities'

// TODO: test current document version of type against type version
// returns new json object as possibly modified document with changed flag
const assertType = (document, type, forceupdate = false) => {

    if ((!document) || (!type) || (!type.properties)) {
        // console.log('return without change assertType')
        return {
            document,
            changed:false,
        }
    }

    // TODO:
    // check versions to see if an update is required; return if not
    // if forceupdate is true then continue in any case

    try {

        // make deep local copy of document to anticipate changes
        let localdocument:any = merge({},document)
        // unpack type data for upgrades
        let {template, defaults, deletions } = type.properties

        //TODO: deletions (from previous versions)
        let { version:doctypeversion } = localdocument.identity.type
        let { version:typeversion } = type.identity

        // console.log('doctypeversion, typeversion',doctypeversion,typeversion)
        let deletionsperformed = false
        if ((doctypeversion === typeversion) && (typeversion !== null)) {

            // check for deletions
            let deletions:[] = type.properties.deletions.versions[doctypeversion]

            if (deletions) {

                let paths = deletions.map((value:string) => {

                    let path = value.split('.')
                    return path

                })

                for (let path of paths) {

                    let nodePosition = utilities.getNodePosition(localdocument,path)

                    if (nodePosition) {

                        let { nodeproperty, nodeindex } = nodePosition
                        delete nodeproperty[nodeindex]
                        if (!deletionsperformed) deletionsperformed = true

                    }
                }
            }
        }

        // get differences between template and current document
        let differences = getDiffs(
            localdocument,
            template,
        )

        // upgrade document with template
        let {document:reviseddocument, changed:datachanged} = getUpgrade(localdocument, differences, defaults)

        datachanged = (datachanged || deletionsperformed)
        // return updgraded document
        return {
            document:reviseddocument,
            changed:datachanged,
        }

    } catch (e) {

        console.log('error in assertType',e)

    }

}

const getDiffs = (document,template) => {

    let differences = deepdiff.diff(document, template, (path, key) => {

        // this item is filtered -- return true means exclude (filter); return false(ish?) means include
        // test scope. if out of scope, stop comparison
        // note: this blocks out legitimate deletions, which need to be handled some other way
        let filter = false

        let templatenodeposition = utilities.getNodePosition(template,path)

        if (!templatenodeposition) {
            filter = true
        }

        if (!filter) {
            let {
                nodeproperty:templateproperty,
                nodeindex:templateindex,
                nodevalue:templatevalue
            } = templatenodeposition

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
    // console.log('getUpgrade original, differences',original,differences)
    let changed = false
    if (differences) {
        for (let changerecord of differences) {

            if ((changerecord.kind == 'N') || (changerecord.kind == 'E')) {

                // console.log('changerecord',changerecord)

                if (changerecord.kind == 'E') {
                    if (!utilities.isObject(changerecord.rhs)) {
                        // if (isObject(changerecord.lhs)) {
                            continue
                        // }
                    }
                }
                if (!changed) changed = true

                // console.log('applying change')
                deepdiff.applyChange(original,null,changerecord)

                if (changerecord.kind == 'N') {

                    // console.log('applying new change record',original, changerecord, defaults)
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

    // console.log('applyNewBranchDefaults original, changerecord, defaults',original, changerecord, defaults)

    // get the path of the value to change
    let path = changerecord.path

    let defaultnodeposition = utilities.getNodePosition(defaults,path)

    if (!defaultnodeposition) return

    let {
        nodeproperty:defaultproperty,
        nodeindex:defaultlindex,
        nodevalue:defaultvalue,
    } = defaultnodeposition

    // =========[ get the document node to apply the default value to ]==========

    // get the matching original property to change to default, based on change path
    let comparandnodeposition = utilities.getNodePosition(original,path)

    if (!comparandnodeposition) return

    let {
        nodeproperty:sourceproperty,
        nodeindex:sourceindex,
        nodevalue:sourcevalue,
    } = comparandnodeposition

    // =================[ apply the default value to the document node ]=============

    if (utilities.isObject(defaultvalue)) { // a branch of defaults is available

        let defaultproperty = defaultvalue // better name

        sourceproperty = sourcevalue

        if (!utilities.isObject(sourceproperty)) {
            console.log('error: mismatch of property and defaults',
                original, defaults, sourceproperty, defaultproperty)
            return
        }

        let differences = getDiffs(sourceproperty,defaultproperty)

        if (differences) {
            for (let changerecord of differences) {

                if (changerecord.kind == 'E') {

                    deepdiff.applyChange(sourceproperty, null, changerecord)

                }

            }
        }

    } else { // a default value is available

        sourceproperty[sourceindex] = defaultvalue

    }

}

// =========================[ export ]==========================

const schemesupport = {
    assertType,
}

export default schemesupport