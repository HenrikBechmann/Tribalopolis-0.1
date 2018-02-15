/*
    TODO: 
    - implement automatic top of page
    - implement call to googla analytics
*/

import * as React from 'react'

import { BrowserRouter, Switch } from 'react-router-dom'

import TransitionWrapper from './transitionwrapper'


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


let AppRouter = (props) => {
    // console.log('AppRouter props',props)
    return (
    <BrowserRouter >
            <Switch>
                {props.children}
            </Switch>
    </BrowserRouter> )
}
    

export default AppRouter
