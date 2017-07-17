/*
    TODO:
    - implement automatic top of page
    - implement call to googla analytics
*/
import * as React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import TransitionWrapper from './transitionwrapper';
let ReactGA = require('react-ga');
ReactGA.initialize('UA-4105209-11');
let logPageView = () => {
    if (window.location.hostname == 'tribalopolis.ca') {
        ReactGA.set({ page: window.location.pathname });
        ReactGA.pageview(window.location.pathname);
    }
};
// onUpdate={ () => 
//     { 
//         window.scrollTo(0, 0)
//         logPageView()
//     }
let AppRouter = (props) => {
    // console.log('AppRouter props',props)
    return (<BrowserRouter>
        <TransitionWrapper>
            <Switch>
                {props.children}
            </Switch>
        </TransitionWrapper>
    </BrowserRouter>);
};
export default AppRouter;
//# sourceMappingURL=approuter.jsx.map