// routes.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later
'use strict'

import React from 'react'

import { Route, Redirect } from 'react-router-dom'

// see https://babeljs.io/docs/en/babel-plugin-syntax-dynamic-import
// import Loadable from 'react-loadable'
// import Spaces from './control/spaces'

import Quadspace from '../ui/quadspace.controller'
import Build from '../ui/system/build.controller'
import Home from '../ui/system/home.controller'
import Test from '../ui/system/test.controller'
import Register from '../ui/system/register.controller'

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
]

let coreroutes = routedata.map((item, index) => (
   <Route key = {'coreroute-'+index} path={item.path} component = {item.component} />
))

let indexroute = <Route key = "workspace" path = "/workspace" component={ Quadspace } />

// let homeroute = <Route key = "home" exact 
//     path = "/" 
//     render={
//         () => (<Redirect to="/workspace"/>)
//     }
// />

// TODO: add /admin and /system

let registerroute = <Route key = "register" path = "/register" component = {Register} />

let homeroute = <Route key = "home" path = "/" component = {Home} />

let testroute = <Route key = "test" path = "/test" component = {Test} />

let buildroute = <Route key = "build" path = "/build" component = {Build} />

const routes = [indexroute,buildroute,registerroute, testroute, homeroute]

export default routes