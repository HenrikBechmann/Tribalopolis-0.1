// index.tsx
'use strict'

import * as React from 'react';
import { render } from 'react-dom'
import injectTapEventPlugin from 'react-tap-event-plugin'

injectTapEventPlugin()
require('isomorphic-fetch')

import Main from './core/main'

let globalmessage = null // 'This is a global message'

render( <Main globalmessage = {globalmessage}/>, document.getElementById('main') )

