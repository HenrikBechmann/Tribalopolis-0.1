import * as React from 'react'

import { Router as BaseRouter, Route, browserHistory } from 'react-router'
let ReactGA = require('react-ga')
ReactGA.initialize('UA-4105209-11')
import Wrapper from './wrapper'

let logPageView = () => {
    if (window.location.hostname == 'tribalopolis.ca') {
        ReactGA.set({ page: window.location.pathname });
        ReactGA.pageview(window.location.pathname);
    }
}

// TODO: see https://github.com/reactjs/react-router-redux
//    for enhanced history link
let Router = (props) => (
    <BaseRouter onUpdate={ () => 
        { 
            window.scrollTo(0, 0)
            logPageView()
        }
    } history={ browserHistory }>
        <Route path="/" component={ Wrapper } >
            {props.children}
        </Route>
    </BaseRouter>)

export default Router
