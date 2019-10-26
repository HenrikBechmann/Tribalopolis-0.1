// verification.filter.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import utilities from '../utilities/utilities'
import firebase from './firebase.api'
import merge from 'deepmerge'
import deepdiff from 'deep-diff'

const verification = new class {

    // ----------------------------[ API ]-----------------------------

    public filterIncomingDocpackDatatypes = ( docpack, typepack ) => {

        let newdoc = merge({}, docpack.document)

        let datadocument = newdoc

        if (typepack) {

            let datatypes = typepack.document.properties.model.datatypes

            let diffs = deepdiff(datadocument,datatypes)

            datadocument = this.processIncomingDatatypes(diffs, datadocument, docpack.document)

        }

        return { // docpack

            document:datadocument,
            reference:docpack.reference
        }

    }

    public filterOutgoingDocpackDatatypes = ( docpack, typepack ) => {

        let newdoc = merge({}, docpack.document)

        let datadocument = newdoc

        if (typepack) {

            let datatypes = typepack.document.properties.model.datatypes

            let diffs = deepdiff(datadocument,datatypes)

            datadocument = this.processOutgoingDatatypes(diffs, datadocument)

        }

        return { // docpack

            document:datadocument,
            reference:docpack.reference
        }

    }

    public filterIncomingValue = ( value, path, type ) => {

        if (!type) return [value,undefined,undefined,undefined]

        let returnvalue = value
        let datatype
        let code = 0
        let severity = 0
        let message = null

        if (type) {

            let datatypes = type.properties.model.datatypes
            let typenode = utilities.getNodePosition(datatypes,path)
            if (!typenode) {
                // nothing...
            } else {

                datatype = typenode.nodevalue

                if (datatype == '??timestamp') {

                    try {

                        returnvalue =  value.toDate()

                    } catch (e) { // try to self-heal
                        returnvalue = value // try to convert to date through new Timestamp
                        if (returnvalue.seconds !== undefined && returnvalue.nanoseconds !== undefined) {
                            returnvalue = new firebase.firestore.Timestamp(returnvalue.seconds, returnvalue.nanoseconds)
                            returnvalue = returnvalue.toDate()
                        }
                    }

                }

            }

        } else {
            console.error('no type document for ',path, value)
        }

        return [returnvalue,datatype, severity, code, message]

    }

    public verifyOutgoingValue = ( value , path, type ) => {

        let datatype
        let code = 0
        let severity = 0
        let message = null
        if (!type) {
            console.log('no type provided for outgoing value conversion: value, path, type',value, path, type)
            return [value,datatype]
        }

        let datatypes = type.properties.model.datatypes

        let nodedata = utilities.getNodePosition(datatypes,path)

        if (!nodedata) {
            console.log('datatype not found for outgoing value, path, type',value, path, type)
            return [value,datatype]
        }

        datatype = nodedata.nodevalue

        // console.log('originalnode',originalnode)
        let outgoingvalue = value

        if (datatype == '??timestamp') {
            try {
                if (outgoingvalue) {
                    outgoingvalue =  firebase.firestore.Timestamp.fromDate(outgoingvalue)
                }
            } catch (e) { // try to self-heal
                console.log('unable to convert outgoing timestamp: value, path, type',value, path, type)
            }
        }

        return [outgoingvalue,datatype,severity,code,message]
    
    }

    // ----------------------[ internal ]-----------------------------

    private processIncomingDatatypes = (diffs, datadocument, originaldocument) => {

        for (let diff of diffs) {

            let { kind, path, rhs:datatype, lhs:incomingvalue } = diff

            if (kind != 'E') {
                console.log('WARNING: unmatched incoming datatype',diff)
                continue
            }

            if (datatype == '??timestamp' && incomingvalue !== null) {

                let originalnode = utilities.getNodePosition(originaldocument,path)
                if (!originalnode) {
                    console.error('nodepositoin not found in application.processIncomingDataTypes',diff)
                    continue
                }

                let value
                try {
                    value =  originalnode.nodevalue.toDate()
                } catch (e) { // try to self-heal
                    value = originalnode.nodevalue // try to convert to date through new Timestamp
                    if (value.seconds !== undefined && value.nanoseconds !== undefined) {
                        value = new firebase.firestore.Timestamp(value.seconds, value.nanoseconds)
                        value = value.toDate()
                    }
                }

                let datanode = utilities.getNodePosition(datadocument,path)
                datanode.nodeproperty[datanode.nodeindex] = value

            }

        }

        return datadocument
    }

    private processOutgoingDatatypes = (diffs, datadocument) => {

        for (let diff of diffs) {

            let { kind, path, rhs:datatype, lhs:outgoingvalue } = diff

            if (kind != 'E') {
                console.log('WARNING: unmatched outgoing datatype',diff)
                continue
            }

            if (datatype == '??timestamp' && outgoingvalue !== null) {

                let targetnode = utilities.getNodePosition(datadocument,path)
                if (!targetnode) {
                    console.error('nodepositoin not found in application.processOutgoingDataTypes',diff)
                    continue
                }

                let value = outgoingvalue
                try {
                    if (value) {
                        value =  firebase.firestore.Timestamp.fromDate(outgoingvalue)
                    }
                } catch (e) { // try to self-heal
                    value = outgoingvalue // try to convert to date through new Timestamp
                }
                targetnode.nodeproperty[targetnode.nodeindex] = value

            }

        }

        return datadocument
    }

}

export default verification
