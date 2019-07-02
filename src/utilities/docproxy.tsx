// docproxy.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later
'use strict'

import {serializer} from './serializer'
import { DocTokenStruc, DocProxyStruc } from '../services/interfaces'

class docproxy {
    constructor(data:DocProxyStruc) {

        let doctoken = this.doctoken = data.doctoken
        if (!doctoken) {
            throw Error('no doctoken for docproxy')
        }
        if (!doctoken.reference) {
            console.log('doctoken reference error',doctoken)
            throw Error('no doctoken.reference for docproxy')
        }
        this.instanceid = serializer.getid()
        let refsplit = doctoken.reference.split('/')
        // console.log('refsplit in docproxy',refsplit)
        // if (data.liststack) {
        //     this.liststack = data.liststack // || []
        // }
        let collection 
        if (doctoken.reference[0] == '/')
            collection = refsplit[1]
        else
            collection = refsplit[0]
        if (collection == 'items' || collection == 'accounts') { // TODO: TEMPORARY
            this.liststack = data.liststack || []
        }
        this.reference = doctoken.reference //`/${doctoken.collection}/${doctoken.id}`
        this.id = refsplit[refsplit.length - 1]
    }
    reference = null
    id = null
    doctoken = null
    instanceid = null
    liststack = null
    settings = {}
}

export default docproxy
