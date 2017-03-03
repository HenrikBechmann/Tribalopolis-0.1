
'use strict'

import * as React from 'react'
// import Radium from 'radium'

import configureStore from './utilities/configurestore'

import Base from './bootstrap/base'
import Router from './bootstrap/router'

import routes from './routes'
// import { autoLoginUser } from '../actions/actions'

const store = configureStore()

// let { auth } = store.getState().login

// if (!auth.isAuthenticated) {
//     let token = localStorage.getItem('jsonwebtoken')
//     if (token) {
//         store.dispatch(autoLoginUser(token))
//     }
// }

//TODO: assign version to state (DEVELOPMENT|STAGING|PRODUCTION)

const Main = (props) => (
    <Base store = {store} globalmessage = {props.globalmessage}>
        <Router>
            {routes}
        </Router>
    </Base>
)

export default Main

