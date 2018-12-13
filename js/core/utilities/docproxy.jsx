// docproxy.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import { serializer } from './serializer';
class docproxy {
    constructor(data) {
        this.reference = null;
        this.id = null;
        this.doctoken = null;
        this.instanceid = null;
        this.liststack = null;
        this.settings = {};
        let doctoken = this.doctoken = data.doctoken;
        if (!doctoken) {
            throw Error('no doctoken for docproxy');
        }
        if (!doctoken.reference) {
            console.log('doctoken reference error', doctoken);
            throw Error('no doctoken.reference for docproxy');
        }
        this.instanceid = serializer.getid();
        let refsplit = doctoken.reference.split('/');
        // console.log('refsplit in docproxy',refsplit)
        if (refsplit[1] == 'items') {
            this.liststack = data.liststack || [];
        }
        this.reference = doctoken.reference; //`/${doctoken.collection}/${doctoken.id}`
        this.id = refsplit[refsplit.length - 1];
    }
}
export default docproxy;
//# sourceMappingURL=docproxy.jsx.map