import * as React from 'react';
import { render } from 'react-dom';
require('isomorphic-fetch');
import Main from './core/start/main.controller';
let globalmessage = null; // 'This is a global message'
try {
    render(<Main globalmessage={globalmessage} version={"DEVELOPMENT"}/>, document.getElementById('main'));
}
catch (e) {
    <div>
        An error has occurred. This application requires a modern browser, like Chrome, Firefox, Safari or MS Edge.
    </div>;
}
//# sourceMappingURL=index.jsx.map