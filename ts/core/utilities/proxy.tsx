// proxy.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import {serializer} from './serializer'

class proxy {
    constructor(data:{token:any,liststack?:any}) {
        let token = this.token = data.token
        this.instanceid = serializer.getid()
        if (token.collection == 'items') {
            this.liststack = data.liststack || []
        }
        this.reference = `${token.collection}/${token.id}`
        this.id = token.id
    }
    reference = null
    id = null
    token = null
    instanceid = null
    liststack = null
    settings = {}
}

export default proxy