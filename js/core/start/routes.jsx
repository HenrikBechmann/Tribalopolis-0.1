// routes.tsx
'use strict';
import React from 'react';
import { Route } from 'react-router-dom';
// see https://babeljs.io/docs/en/babel-plugin-syntax-dynamic-import
// import Loadable from 'react-loadable'
// import Spaces from './control/spaces'
import Quadspace from '../ui/quadspace.controller';
import Build from '../ui/build.controller';
import Home from '../ui/home.controller';
// import ResetPassword from '../containers/resetpassword'
// import Register from '../containers/register'
// import RegisterPending from '../containers/registerpending'
// import RegisterConfirm from '../containers/registerconfirm'
// import UserProfile from '../containers/userprofile'
// import NoMatch  from '../containers/nomatch'
// import approutes from '../../addins/approutes'
// const Loading = () => <div>Loading...</div>
// const Home = Loadable(
//     {
//         loader:() => import ('../ui/home.controller'),
//         loading:Loading,
//     }
// )
// const Quadspace = Loadable(
//     {
//         loader:() => import ('../ui/quadspace.controller'),
//         loading:Loading,
//     }
// )
// const Build = Loadable(
//     {
//         loader:() => import ('../ui/build.controller'),
//         loading:Loading,
//     }
// )
let routedata = [
// { path: "resetpassword", component: ResetPassword },
// { path: "register", component: Register },
// { path: "register/pending", component: RegisterPending },
// { path: "register/confirm", component: RegisterConfirm },
// { path: "userprofile", component: UserProfile },
// { path: "*", component: NoMatch }, // must be LAST, or else will pre-empt other paths
];
let coreroutes = routedata.map((item, index) => (<Route key={'coreroute-' + index} path={item.path} component={item.component}/>));
let indexroute = <Route key="workspace" path="/workspace" component={Quadspace}/>;
// let homeroute = <Route key = "home" exact 
//     path = "/" 
//     render={
//         () => (<Redirect to="/workspace"/>)
//     }
// />
let homeroute = <Route key="home" path="/" component={Home}/>;
let buildroute = <Route key="build" path="/build" component={Build}/>;
const routes = [indexroute, buildroute, homeroute];
export default routes;
//# sourceMappingURL=routes.jsx.map