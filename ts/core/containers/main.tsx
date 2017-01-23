
'use strict'

import * as React from 'react'

import configureStore from '../configurestore'
// import Root from '../common/root'

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
    // <Root store={store} />
const Main = () => (
    <div>
    <div style={{backgroundColor:'lightgray',minHeight:'40px'}} >Toolbar</div>
    <div style={{backgroundColor:'palegoldenrod',minHeight:'16px'}} >Title</div>
    <div style={{minHeight:'300px'}} >
    <div style={
        {
            float:'left',
            minWidth:'60px',
            minHeight:'60px',
            border:'1px solid silver',
            backgroundColor:'lightblue',
        }
    }>Origin
    </div>
    Graph</div>
    <div style={{backgroundColor:'lightgreen',minHeight:'120px'}} >List</div>
    </div>
)

export default Main

