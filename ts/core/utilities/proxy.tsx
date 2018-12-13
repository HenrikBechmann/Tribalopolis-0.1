// proxy.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import {serializer} from './serializer'

class proxy {
    constructor(data:{doctoken:any,liststack?:any}) {
        let doctoken = this.doctoken = data.doctoken
        this.instanceid = serializer.getid()
        if (doctoken.collection == 'items') {
            this.liststack = data.liststack || []
        }
        this.reference = `/${doctoken.collection}/${doctoken.id}`
        this.id = doctoken.id
    }
    reference = null
    id = null
    doctoken = null
    instanceid = null
    liststack = null
    settings = {}
}

export default proxy
