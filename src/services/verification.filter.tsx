// verification.filter.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import firebase from './firebase.api' // only for time handling
import merge from 'deepmerge'
import deepdiff from 'deep-diff'
import { GenericObject } from './interfaces'

import utilities from '../utilities/utilities'

const verification = new class {

    public filterIncomingValue = ( value, path, typedoc ) => {

        if (!typedoc) return [value,undefined,undefined,undefined,undefined]

        let returnvalue
        let properties:any = {datatype:undefined}
        let code = 0, severity = 0, message = null

        try {

            properties.datatype = this.getDatatype(path, typedoc);

            [returnvalue, properties, severity, code, message] = 
                this.filterValueDatatype(value, properties)

        } catch(e) {

            severity = 2
            code = e.name
            message = e.message

        }

        return [ returnvalue, properties, severity, code, message ]

    }

    private getDatatype = (path, typedoc) => {
        let datatype

        if (!typedoc || !path) {

            console.error('no datatype path or typedoc for ',path, typedoc)

            return datatype

        }

        let datatypes = typedoc.properties.model.datatypes
        let typenode = utilities.getNodePosition(datatypes,path)
        if (typenode) {

            datatype = typenode.nodevalue

        }

        return datatype

    }

    private getConstraints = (path, typedoc) => {
        let constraints

        if (!typedoc || !path) {

            console.error('no constraint path or typedoc for ',path, typedoc)

            return constraints

        }

        constraints = typedoc.properties.model.constraints
        let typenode = utilities.getNodePosition(constraints,path)
        if (typenode) {

            constraints = typenode.nodevalue

            // console.log('constraints found', constraints)

        }

        return constraints

    }

    private filterValueDatatype = (value, properties) => {
        let { datatype } = properties
        if (!datatype) return [value, properties, undefined, undefined, undefined]

        let returnvalue
        let severity = 0, code = 0, message = null

        if (datatype == '??timestamp') {

            try {

                returnvalue =  value.toDate()

            } catch (e) { // try to self-heal
                returnvalue = value // try to convert to date through new Timestamp
                if (returnvalue.seconds !== undefined && returnvalue.nanoseconds !== undefined) {
                    returnvalue = new firebase.firestore.Timestamp(returnvalue.seconds, returnvalue.nanoseconds)
                    returnvalue = returnvalue.toDate()
                } else {
                    severity = 2
                    code = e.name
                    message = e.message
                }
            }

        } else {

            returnvalue = value
            
        }

        return [returnvalue, properties, severity, code, message]

    }

    public verifyOutgoingValue = ( value , path, typedoc ) => {

        let outgoingvalue
        let properties:GenericObject = {datatype:null,constraints:null}
        let code = null
        let severity = 0
        let message = null
        if (!typedoc) {
            console.log('no type provided for outgoing value conversion: value, path, type',value, path, typedoc)
            return [value,properties,undefined, undefined, undefined]
        }

        properties.datatype = this.getDatatype(path, typedoc)

        properties.constraints = this.getConstraints(path, typedoc);

        [outgoingvalue, properties, severity, code, message] = this.verifyValueDatatype(value,properties) 

        if (!(severity === 2)) {
            [outgoingvalue, properties, severity, code, message] = this.verifyValueConstraints(outgoingvalue, properties)
        }

        let retval = [outgoingvalue,properties,severity,code,message]

        // console.log('result of verifyoutgoingvalue', retval)

        return retval
    
    }

    private verifyValueDatatype = (value, properties) => {

        let outgoingvalue = value
        let severity = 0, code = null, message = null

        if (properties.datatype == '??timestamp') {
            try {
                if (outgoingvalue) {
                    outgoingvalue =  firebase.firestore.Timestamp.fromDate(outgoingvalue)
                }
            } catch (e) { // try to self-heal
                severity = 2
                code = 'e.name'
                message = 'unable to convert outgoing timestamp'
                console.log('unable to convert outgoing timestamp: value, properties',value, properties)
            }
        }

        return [outgoingvalue, properties, severity, code, message]

    }

    // add handlers for all constraints
    private verifyValueConstraints = (value, properties) => {
        // console.log('in verifyValueConstraints',value, properties)
        let outgoingvalue = value
        let severity = 0, code = null, message = null
        let {constraints} = properties

        if (constraints) {
            for (let constraint in constraints) {
                switch (constraint) {
                    case 'required': {
                        if (value === null || value === undefined || value === '') {
                            severity = 2
                            code = 'required'
                            message = 'a value is required'
                        }
                    }
                }
            }
        }

        return [outgoingvalue,properties,severity,code,message]
    }
    // ----------------------------[ BUILD API ]-----------------------------

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

    // ----------------------[ build utilities ]-----------------------------

    // TODO: run checks through standard routines

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
