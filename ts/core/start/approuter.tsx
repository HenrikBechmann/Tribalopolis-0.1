/*
    TODO: 
    - implement automatic top of page
    - implement call to googla analytics
*/

import * as React from 'react'
// import { ConnectedRouter } from 'react-router-redux'
import { Switch, Route, Redirect, Router } from 'react-router-dom'
// import { connect } from 'react-redux'
import routes from "./routes"

import createBrowserHistory from 'history/createBrowserHistory'

const customHistory = createBrowserHistory()

// import TransitionWrapper from './transitionwrapper'


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


let AppRouter = class extends React.Component<any,any> {
    // console.log('AppRouter props',props)
    render() {
        // let location = this.props.router.location || {}
        return (
            <Router history = {customHistory}>
                <Switch>
                    { routes }
                </Switch>
            </Router>
        )
    }
}
    
let mapStateToProps = state => {
    let { router } = state
    return { 
        router,
    }
}

// AppRouter = connect(mapStateToProps)(AppRouter)

export  { AppRouter }
