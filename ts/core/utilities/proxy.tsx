// proxy.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import {serializer} from './serializer'

class proxy {
    constructor({token}) {
        this.token = token
        this.instanceid = serializer.getid()
        if (token.repo == 'items') {
            this.liststack = []
        }
        this.path = `${token.repo}/${token.uid}`
        this.uid = token.uid
    }
    path = null
    uid = null
    token = null
    instanceid = null
    liststack = null
    settings = {}
}

export default proxy