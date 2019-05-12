// main.view.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

/*
    TODO: embed global message in some html
*/

// display the app
'use strict'

import React from 'react'

import AppRouter from './approuter'

const MainView = ({globalmessage, className}) => {

    return <div className = {className}
        >
        {globalmessage}

        <AppRouter />
        
    </div>
}

export default MainView
