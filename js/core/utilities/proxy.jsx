// proxy.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import { serializer } from './serializer';
class proxy {
    constructor(data) {
        this.reference = null;
        this.id = null;
        this.token = null;
        this.instanceid = null;
        this.liststack = null;
        this.settings = {};
        let token = this.token = data.token;
        this.instanceid = serializer.getid();
        if (token.collection == 'items') {
            this.liststack = data.liststack || [];
        }
        this.reference = `/${token.collection}/${token.id}`;
        this.id = token.id;
    }
}
export default proxy;
//# sourceMappingURL=proxy.jsx.map