// route.controller.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later
/*
    TODO: 
    - implement automatic top of page
    - implement call to googla analytics
*/

'use strict'

import React from 'react'
import { withRouter, Switch, Redirect } from 'react-router-dom'
import routes from "./routes"

import application from '../services/application'

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


let RouteController = (props) => {

    // console.log('props in RouteController',props)

    let userdata = application.userdata

    return (((userdata.status == 'loggedin')||(userdata.status == 'registered-user')) && (props.location.pathname != '/register'))?<Redirect to = '/register'/>:
        <Switch>
            { routes }
        </Switch>

}
    
export default withRouter(RouteController)
