// proxy.tsx
import { serializer } from './serializer';
class proxy {
    constructor({ token }) {
        this.token = null;
        this.instanceid = null;
        this.liststack = null;
        this.settings = {};
        this.token = token;
        this.instanceid = serializer.getid();
        if (token.repo == 'items') {
            this.liststack = [];
        }
    }
}
export default proxy;
//# sourceMappingURL=proxy.jsx.map