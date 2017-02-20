
'use strict'

import * as React from 'react'
import Radium from 'radium'

import configureStore from './utilities/configurestore'
import routes from './containers/routes'

import Root from './containers/root'

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
    // <Root store={store} globalmessage={globalmessage} routes={routes}/>
const Main = () => (
    <div>
        <div style={styles.toolbar} >Toolbar</div>
        <div style={styles.title} >Title</div>
        <div>Nodes: </div>
        <div>Links: </div>
        <div style={styles.graph} >
            <div style={styles.origin}
            >
                Origin
            </div>
            Graph
        </div>
        <div style={styles.status} >Status</div>
        <div style={styles.list} >List</div>
    </div>
)

let styles = {
    origin:{
        float:'left',
        minWidth:'60px',
        minHeight:'60px',
        border:'1px solid silver',
        backgroundColor:'lightblue',
    },
    toolbar:{backgroundColor:'lightgray',minHeight:'40px'},
    title:{backgroundColor:'palegoldenrod',minHeight:'16px'},
    status:{backgroundColor:'palegoldenrod',minHeight:'16px'},
    graph:{minHeight:'300px'},
    list:{backgroundColor:'lightgreen',minHeight:'120px'},
}

export default Radium(Main)

