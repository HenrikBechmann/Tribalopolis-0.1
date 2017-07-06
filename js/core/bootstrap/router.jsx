import * as React from 'react';
import { Router as BaseRouter, Route, Switch, browserHistory } from 'react-router-dom';
let ReactGA = require('react-ga');
ReactGA.initialize('UA-4105209-11');
import Wrapper from './wrapper';
let logPageView = () => {
    if (window.location.hostname == 'tribalopolis.ca') {
        ReactGA.set({ page: window.location.pathname });
        ReactGA.pageview(window.location.pathname);
    }
};
let Router = (props) => (<BaseRouter history={browserHistory}>
    <Switch onUpdate={() => {
    window.scrollTo(0, 0);
    logPageView();
}}>
        <Route path="/" component={Wrapper}>
            {props.children}
        </Route>
    </Switch>
    </BaseRouter>);
export default Router;
//# sourceMappingURL=router.jsx.map