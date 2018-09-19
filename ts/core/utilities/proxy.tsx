// proxy.tsx

import {serializer} from './serializer'

class proxy {
    constructor({token}) {
        this.token = token
        this.instanceid = serializer.getid()
        if (token.repo == 'items') {
            this.liststack = []
        }
    }
    token = null
    instanceid = null
    liststack = null
    settings = {}
}

export default proxy