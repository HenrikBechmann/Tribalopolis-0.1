// approuter.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later
/*
    TODO: 
    - implement automatic top of page
    - implement call to googla analytics
*/

'use strict'

import React from 'react'
import { Switch, Router } from 'react-router-dom'
import routes from "./routes"

import { createBrowserHistory } from 'history'

const customHistory = createBrowserHistory()

// current release of react-ga 2.31 is broken
// let ReactGA = require('react-ga')
// console.log('ReactGA',ReactGA)
// ReactGA.initialize('UA-4105209-11')

// let logPageView = () => {
//     if (window.location.hostname == 'tribalopolis.ca') {
//         ReactGA.set({ page: window.location.pathname });
//         ReactGA.pageview(window.location.pathname);
//     }
// }

// onUpdate={ () => 
//     { 
//         window.scrollTo(0, 0)
//         logPageView()
//     }


let AppRouter = () => (

    <Router history = {customHistory}>
        <Switch>
            { routes }
        </Switch>
    </Router>

)
    
export default AppRouter
