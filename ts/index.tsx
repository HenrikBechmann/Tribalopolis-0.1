// index.tsx
'use strict'

import * as React from 'react';
import { render } from 'react-dom'
import injectTapEventPlugin from 'react-tap-event-plugin'

injectTapEventPlugin()
require('isomorphic-fetch')

import Main from './core/containers/main'

render( <Main />, document.getElementById('app') )

