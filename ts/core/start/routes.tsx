// routes.tsx
'use strict'

import * as React from 'react'

import { Route, Redirect } from 'react-router-dom'

// import Spaces from './control/spaces'
import QuadspaceController from '../ui/quadspace.controller'

// import ResetPassword from '../containers/resetpassword'
// import Register from '../containers/register'
// import RegisterPending from '../containers/registerpending'
// import RegisterConfirm from '../containers/registerconfirm'
// import UserProfile from '../containers/userprofile'
// import NoMatch  from '../containers/nomatch'

// import approutes from '../../addins/approutes'

let routedata = [

    // { path: "resetpassword", component: ResetPassword },
    // { path: "register", component: Register },
    // { path: "register/pending", component: RegisterPending },
    // { path: "register/confirm", component: RegisterConfirm },
    // { path: "userprofile", component: UserProfile },
    // { path: "*", component: NoMatch }, // must be LAST, or else will pre-empt other paths
]

let coreroutes = routedata.map((item, index) => (
   <Route key = {'coreroute'+index} path={item.path} component = {item.component} />
))

let indexroute = <Route key = "_WORKSPACE_" path = "/workspace" component={ QuadspaceController } />

let homeroute = <Route key = "_HOME_" exact path = "/" render={() => (
    <Redirect to="/workspace"/>
)}/>

const routes = [indexroute,homeroute]

export default routes