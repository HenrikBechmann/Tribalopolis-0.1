// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
// main.view.tsx

/*
    TODO: embed global message in some html
*/

// display the app
'use strict'

import * as React from 'react'

import { AppRouter } from './approuter'

const MainView = ({globalmessage, style}) => (
    <div style = {style}>
        {globalmessage}

        <AppRouter />

    </div>
)

export default MainView
