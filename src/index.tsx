
import '@babel/polyfill'

import React from 'react';
import { render } from 'react-dom'

require('isomorphic-fetch')

import Main from './core/start/main.controller'

let globalmessage = null // 'This is a global message'

window['__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__'] = true // per https://material-ui.com/style/typography/#migration-to-typography-v2

try {
render( <Main globalmessage = {globalmessage}
     version={"DEVELOPMENT"}/>, 
     document.getElementById('main') )
} catch (e) {
    <div>
        An error has occurred. This application requires a modern browser, like Chrome, Firefox, Safari or MS Edge.
    </div>
}

