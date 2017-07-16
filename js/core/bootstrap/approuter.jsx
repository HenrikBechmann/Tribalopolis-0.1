/*
    TODO:
    - implement automatic top of page
    - implement call to googla analytics
    - integrate Wrapper
*/
import * as React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import Wrapper from './wrapper';
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
// <Route path="/" component={ Wrapper } />
let AppRouter = (props) => {
    // console.log('AppRouter props',props)
    return (<BrowserRouter>
        <Wrapper>
            <Switch>
                {props.children}
            </Switch>
        </Wrapper>
    </BrowserRouter>);
};
export default AppRouter;
//# sourceMappingURL=approuter.jsx.map