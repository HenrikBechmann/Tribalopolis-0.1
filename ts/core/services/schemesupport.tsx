// schemesupport.class.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence

import { DeepDiff } from 'deep-diff'
import merge from 'deepmerge'

// TODO: test current document version of type against type version
const assertType = (docpack, typepack) => {

    console.log('assertType',docpack, typepack)
    let localdocpack:any = merge({},docpack)
    let {structure, defaults, constraints, template} = typepack.document.properties
    console.log('structure, defaults, contraints',structure, defaults, constraints, template, localdocpack)
    let differences = getDiffs(
        localdocpack.document,
        template,
    )
    let {document, changed} = getUpgrade(localdocpack.document, differences, defaults, constraints)
    console.log('differences, upgrade', differences, document)
    return {
        document,
        changed,
    }
}

const getDiffs = (document,structure) => {
    let differences = DeepDiff.diff(document,structure)
    return differences
}

const getUpgrade = (original, differences, defaults, constraints) => {
    let changed = false
    for (let changerecord of differences) {
        if ((changerecord.kind == 'N') || (changerecord.kind == 'D') ) {
            if (!changed) changed = true
            DeepDiff.applyChange(original,null,changerecord)

        }
    }
    return {
        document:original,
        changed,
    }
}

const schemesupport = {
    assertType,
}

export default schemesupport