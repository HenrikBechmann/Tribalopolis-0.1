// routes.tsx
'use strict';
import * as React from 'react';
import { Route, IndexRoute } from 'react-router';
import Spaces from './containers/spaces';
// import ResetPassword from '../containers/resetpassword'
// import Register from '../containers/register'
// import RegisterPending from '../containers/registerpending'
// import RegisterConfirm from '../containers/registerconfirm'
// import UserProfile from '../containers/userprofile'
// import NoMatch  from '../containers/nomatch'
// import approutes from '../../addins/approutes'
let routedata = [];
let coreroutes = routedata.map((item, index) => (<Route key={'coreroute' + index} path={item.path} component={item.component}/>));
let indexroute = <IndexRoute key="_INDEX_" component={Spaces}/>;
const routes = [indexroute, ...coreroutes];
export default routes;
//# sourceMappingURL=routes.jsx.map