// proxy.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import { serializer } from './serializer';
class proxy {
    constructor(data) {
        this.reference = null;
        this.id = null;
        this.doctoken = null;
        this.instanceid = null;
        this.liststack = null;
        this.settings = {};
        let doctoken = this.doctoken = data.doctoken;
        this.instanceid = serializer.getid();
        if (doctoken.collection == 'items') {
            this.liststack = data.liststack || [];
        }
        this.reference = `/${doctoken.collection}/${doctoken.id}`;
        this.id = doctoken.id;
    }
}
export default proxy;
//# sourceMappingURL=proxy.jsx.map