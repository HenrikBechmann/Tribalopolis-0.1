// proxy.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import { serializer } from './serializer';
class proxy {
    constructor(data) {
        this.reference = null;
        this.uid = null;
        this.token = null;
        this.instanceid = null;
        this.liststack = null;
        this.settings = {};
        let token = this.token = data.token;
        this.instanceid = serializer.getid();
        if (token.repo == 'items') {
            this.liststack = data.liststack || [];
        }
        this.reference = `${token.repo}/${token.uid}`;
        this.uid = token.uid;
    }
}
export default proxy;
//# sourceMappingURL=proxy.jsx.map