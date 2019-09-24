// type.filter.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

/*
    TODO: 
    - program transfer function; must succeed if deletions is implemented
    - automatic set of deletion list (compare type versions)
*/

'use strict'

import deepdiff from 'deep-diff'
// import merge from 'deepmerge'

import utilities from '../utilities/utilities'
import functions from '../services/functions'

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
    
    - TODO: Types should be chained to systematically go through the type versions compared to the 
    document version

    TECHNICALLY:
    - Returns a json document object, which may be a (cloned) modified document with an
    accompanying changed flag.
    - Change instructions are derived from comparison of type elements with instance elements.
    assertType is the only pulic method
*/
    public assertType = (document, type) => { //, forceupdate = false) => {

        let localdocument:any = document // || {}

        // console.log('inside assertType BEFORE FILTER',document, type, type.properties.model)

        if ((document === undefined) && type && type.properties.model) {
            localdocument = {}
        }

        // the document and its type are required to evaluate the document for update
        if ((!localdocument) || (!type) || (!type.properties.model)) {
            // console.log('assertType returning from FILTER')
            return {
                document:localdocument,
                changed:false,
            }
        }

        // console.log('inside assertType',document, type)

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
            // let localdocument:any = merge({},document)

            // unpack type data required for upgrades
            let {defaults, deletions } = type.properties.model
            let { template } = type.properties

            //TODO: deletions (from previous versions)
            // let { version:doctypeversion } = localdocument.control.type
            // let { version:typeversion } = type.control

            let doctypeversion = localdocument.control && localdocument.control.type.version
            let typeversion = type.control.version

            // ------------------[ DO DELTIONS ]----------------------------------

            let deletionsperformed = false
            // document and type versions must exist and be the same
            if ((doctypeversion === typeversion) && (typeversion !== null)) {

                let deletionlist:[] = deletions.versions[doctypeversion]
                // localdocument can be modified
                deletionsperformed = this.assertDeletions( localdocument, deletionlist )

            }

            // ------------------[ DO UPGRADE ]----------------------------------

            // get differences of the template (from the type) against the current document
            // (after deletions)
            let differences = this.getDiffs(
                localdocument,
                template,
            )

            // Upgrade the document according to differencee from template; add the properties 
            // if necessary and apply the defaults
            let {document:reviseddocument, changed:datachanged} = 
                this.getUpgrade(localdocument, differences, defaults)

            datachanged = (datachanged || deletionsperformed)

            // return updgraded document
            let retval = {

                document:reviseddocument,
                changed:datachanged,

            }
            // console.log('retval returned from assertType',retval)
            return retval

        } catch (e) {

            console.log('error in assertType',e, document, type)

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
        let differences = deepdiff.diff(document, template)
        if (!differences) return differences
        let newdifferences = []
        if (differences) {
            for (let index in differences) {
                if (differences[index].kind == 'N') {
                    newdifferences.push(differences[index])
                }
            }
        }

        if (!newdifferences.length) newdifferences = undefined

        return newdifferences

    }

    private getUpgrade = (original, differences, defaults) => {

        // console.log('inside getUpgrade',original, differences, defaults)

        if (!differences) return {
            document:original,
            changed:false,
        }

        let changed = true

        for (let changerecord of differences) {

            // console.log('processing ',changerecord)

            deepdiff.applyChange(original,null,changerecord)

            // console.log('revised ',original)

            // this.applyNewBranchDefaults(changerecord, original, defaults)

        }

        this.applyDefaults(original, defaults)

        return {
            document:original,
            changed,
        }
    }

    // this applies default value for each individual change
    // change could involve an entire branch
    private applyDefaults = (original, defaults) => {

        let pathlist = this.getPathList(original, [])

        // console.log('pathlist in applyDefaults',pathlist)

        for (let path of pathlist) {
            this.applyEachDefault(original, path, defaults)
        }

    }

    private applyEachDefault = (original,path,defaults) => {

        // console.log('inside applyEachDefault: original, path, defaults',original, path, defaults)

        // =========[ get the default value to apply ]==========

        // get the path of the value to change

        let defaultnodeposition = utilities.getNodePosition(defaults,path)

        if (!defaultnodeposition) return // no default value found

        let {
            nodeproperty:defaultproperty,
            nodeindex:defaultlindex,
            nodevalue:defaultvalue,
        } = defaultnodeposition

        if (utilities.isObject(defaultvalue)) { // a branch of defaults is available
            let variant = defaultvalue['#variant']
            // console.log('applyEachDefaults -object-:defaultvalue, variant, variant == true',defaultvalue, variant, variant == true)
            if (variant) {
                // console.log('in if statement', variant)
                switch (variant) {
                    case 'function':{
                        defaultvalue = functions[defaultvalue.function]()
                        // console.log('function result',defaultvalue)
                        break
                    }
                    default:
                        return
                }
            } else {
                return // only base types allowed for defaults
            }

        }

        // =========[ get the document node to apply the default value to ]==========

        // get the matching original property to change to default, based on change path
        let originalnodeposition = utilities.getNodePosition(original,path)

        if (!originalnodeposition) return

        let {
            nodeproperty:sourceproperty,
            nodeindex:sourceindex,
            nodevalue:sourcevalue,
        } = originalnodeposition

        // =================[ apply the default value to the document node ]=============

        if (sourceproperty[sourceindex] === null) {

            sourceproperty[sourceindex] = defaultvalue

            // console.log('applied sourceproperty[sourceindex] = defaultvalue',sourceproperty[sourceindex],original)

        }

    }

    private getPathList = (obj, path) => {

        let sublist = []
        let keylist = Object.keys(obj)
        let pathlist = []
        for (let index of keylist) {
            let value = obj[index];
            (!value) && pathlist.push(path.concat(index)) // if it has a value it can't use the default
            if (utilities.isObject(value)) {

                let newlist = this.getPathList(value, path.concat(index))
                pathlist = pathlist.concat(newlist)
            }
        }
        return pathlist
    }
}
// =========================[ export ]==========================

export default typefilter