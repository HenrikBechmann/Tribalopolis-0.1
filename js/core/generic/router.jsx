// copyright (c) 2016 Henrik Bechmann, Toronto, MIT Licence
// routes.tsx
'use strict';
import * as React from 'react';
import { Router as BaseRouter, Route, IndexRoute, browserHistory } from 'react-router';
let ReactGA = require('react-ga');
ReactGA.initialize('UA-4105209-11');
// import App from './app'
// // TODO: isolate hometiles as plugin
// import HomeTiles from '../containers/hometiles'
// import ResetPassword from '../containers/resetpassword'
// import Register from '../containers/register'
// import RegisterPending from '../containers/registerpending'
// import RegisterConfirm from '../containers/registerconfirm'
// import UserProfile from '../containers/userprofile'
// import NoMatch  from '../containers/nomatch'
// import approutes from '../../addins/approutes'
let logPageView = () => {
    if (window.location.hostname == 'tribalopolis.ca') {
        ReactGA.set({ page: window.location.pathname });
        ReactGA.pageview(window.location.pathname);
    }
};
let routedata = [];
let coreroutes = routedata.map((item, index) => (<Route key={'coreroute' + index} path={item.path} component={item.component}/>));
// TODO: see https://github.com/reactjs/react-router-redux
//    for enhanced history link
let Router = (props) => (<BaseRouter onUpdate={() => {
    window.scrollTo(0, 0);
    logPageView();
}} history={browserHistory}>
        <Route path="/" component={null}>
            <IndexRoute component={null}/>
             //approutes
//approutes
            {coreroutes}
        </Route>
    </BaseRouter>);
export default Router;
//# sourceMappingURL=router.jsx.map