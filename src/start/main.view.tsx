// main.view.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

/*
    TODO: embed global message in some html
*/

// display the app
'use strict'

import React from 'react'
import { createBrowserHistory } from 'history'
import { Router } from 'react-router-dom'

import RouteController from './route.controller'

const customHistory = createBrowserHistory()

const MainView = ({globalmessage, className, status}) => {

    return <div className = {className}
        >
        {globalmessage}

        {(status == 'active') && <Router history = {customHistory}><RouteController /></Router>}
        
    </div>
}

export default MainView
