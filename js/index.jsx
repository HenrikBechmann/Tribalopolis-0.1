import * as React from 'react';
import { render } from 'react-dom';
// import injectTapEventPlugin from 'react-tap-event-plugin'
// import 'react-redux-toastr/lib/css/react-redux-toastr.min.css'
// injectTapEventPlugin()
require('isomorphic-fetch');
import MainController from './core/start/main.controller';
let globalmessage = null; // 'This is a global message'
try {
    render(<MainController globalmessage={globalmessage} version={"DEVELOPMENT"}/>, document.getElementById('main'));
}
catch (e) {
    <div>
        This application requires a modern browser, like Chrome, Firefox, Safari or MS Edge.
    </div>;
}
//# sourceMappingURL=index.jsx.map