// docproxy.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import {serializer} from './serializer'
import { DocTokenInterface, DocProxyInterface } from '../services/interfaces'

class docproxy {
    constructor(data:DocProxyInterface) {
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
        if (refsplit[1] == 'items') {
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
