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

const typefilter = new class {

/*    
    TODO: 
    - Test current document version of type against type version
    - Implemeent forceupdate
    - Support chained types, compared to document type

    FUNCTIONALLY:
    - The typefilter singleton updates the downloaded Firebase Store document structure to 
    conform to the document's most recent type version.
    
    - These updates are only applied to the datastore document if the document is 
    explicitly submitted for a save to the database. Otherwise the updates are thrown away.
    
    - Types can be chained to systematically go through the type versions compared to the 
    document version

    TECHNICALLY:
    - Returns a json document object, which may be a (cloned) modified document with an
    accompanying changed flag.
    - Change instructions are derived from comparison of type elements with instance elements.
    assertType is the only pulic method
*/
    public assertType = (document, type, forceupdate = false) => {

        // the document and its type are required to evaluate the document for update
        if ((!document) || (!type) || (!type.properties.model)) {
            return {
                document,
                changed:false,
            }
        }

/*
        TODO:
        Check versions to see if an update is required; return if not
        if forceupdate is true then continue in any case
        iterate through chain of types from document version to most recent type version. 
            THIS IS DEFERREED
*/
        try {

            // ------------------[ SETUP ]----------------------------------

            // make deep local copy of document to anticipate changes
            let localdocument:any = merge({},document)

            // unpack type data required for upgrades
            let {template, defaults, deletions } = type.properties.model

            //TODO: deletions (from previous versions)
            let { version:doctypeversion } = localdocument.identity.type
            let { version:typeversion } = type.identity

            // ------------------[ DO DELTIONS ]----------------------------------

            // console.log('doctypeversion, typeversion',doctypeversion,typeversion)
            let deletionsperformed = false
            if ((doctypeversion === typeversion) && (typeversion !== null)) {

                let deletionlist:[] = deletions.versions[doctypeversion]
                // localdocument can be modified
                deletionsperformed = this.assertDeletions( localdocument, deletionlist )

            }

            // ------------------[ DO UPGRADE ]----------------------------------

            // get differences between template (from the type) and the current document
            // (after deletions)
            let differences = this.getDiffs(
                localdocument,
                template,
            )

            console.log('differences',differences, localdocument, template)

            // Upgrade the document according to differencee from template; add the properties 
            // if necessary and apply the defaults
            let {document:reviseddocument, changed:datachanged} = 
                this.getUpgrade(localdocument, differences, defaults)

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

    private assertDeletions(localdocument, deletionlist) {
        let deletionsperformed = false
                // check for deletions
        if (deletionlist) {

            let paths = deletionlist.map((value:string) => {

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

        return deletionsperformed
    }

    private getDiffs = (document,template) => {

        // diff fiters each comparison through the third parameter function
        let differences = deepdiff.diff(document, template, 
            // this function is the third parameter of deepdiff.diff
            (path, key) => {

            // this item is filtered -- return true means exclude (filter); return false(ish?) means include
            // test scope. if out of scope, stop comparison
            // note: this blocks out legitimate deletions, which need to be handled some other way
            let filterthisitem = false // meaning include this item is the default

            // see if the path for this diff is in the template
            let templatenodeposition = utilities.getNodePosition(template,path)

            // if not, filter the change = take no action
            if (!templatenodeposition) { // the comparison was not found in the template; to not process
                filterthisitem = true
            }

            // console.log('filter diffs: path, key, templatenodeposition',path,key,templatenodeposition)

            // if the item has not yet been rejected (filtered), then apply next text
            if (!filterthisitem) {
                let {
                    nodeproperty:templateproperty,
                    nodeindex:templateindex,
                    nodevalue:templatevalue
                } = templatenodeposition


                // let testproperty = templatevalue
                let testvalue = templatevalue?templatevalue[ key ]:undefined
                if (testvalue === undefined) {
                    filterthisitem = true
                }
            }

            return filterthisitem // true or false; true denotes leave the item out (filter it out)

        })

        return differences

    }

    private getUpgrade = (original, differences, defaults) => {

        if (!differences) return {
            document:original,
            changed:false,
        }

        let changed = false

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
                    this.applyNewBranchDefaults(original, changerecord, defaults)

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
    private applyNewBranchDefaults = (original, changerecord, defaults) => {

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

            let differences = this.getDiffs(sourceproperty,defaultproperty)

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
}
// =========================[ export ]==========================

export default typefilter