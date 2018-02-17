// routes.tsx
'use strict';
import * as React from 'react';
import { Route } from 'react-router-dom';
// import Spaces from './control/spaces'
import Quad from '../control/quad.controller';
// import ResetPassword from '../containers/resetpassword'
// import Register from '../containers/register'
// import RegisterPending from '../containers/registerpending'
// import RegisterConfirm from '../containers/registerconfirm'
// import UserProfile from '../containers/userprofile'
// import NoMatch  from '../containers/nomatch'
// import approutes from '../../addins/approutes'
let routedata = [];
let coreroutes = routedata.map((item, index) => (<Route key={'coreroute' + index} path={item.path} component={item.component}/>));
let indexroute = <Route key="_INDEX_" path="/" component={Quad}/>;
const routes = [indexroute];
export default routes;
//# sourceMappingURL=routes.jsx.map