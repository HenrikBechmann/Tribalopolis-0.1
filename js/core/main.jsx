'use strict';
import * as React from 'react';
// import Radium from 'radium'
import configureStore from './utilities/configurestore';
import Base from './generic/base';
import { styles } from './utilities/styles';
// import { autoLoginUser } from '../actions/actions'
const store = configureStore();
// let { auth } = store.getState().login
// if (!auth.isAuthenticated) {
//     let token = localStorage.getItem('jsonwebtoken')
//     if (token) {
//         store.dispatch(autoLoginUser(token))
//     }
// }
let globalmessage = null; // 'This is a global message'
const MainBar = (props) => (<div style={props.style}>Toolbar</div>);
//TODO: assign version to state (DEVELOPMENT|STAGING|PRODUCTION)
// <Root store={store} globalmessage={globalmessage} routes={routes}/>
const Main = () => (<Base store={store} globalmessage={globalmessage}>
        <MainBar style={styles.toolbar}/>
        <div style={styles.title}>Title</div>
        <div>Nodes: </div>
        <div>Links: </div>
        <div style={styles.graph}>
            <div style={styles.origin}>
                Origin
            </div>
            Graph
        </div>
        <div style={styles.status}>Status</div>
        <div style={styles.list}>List</div>
    </Base>);
export default Main;
//# sourceMappingURL=main.jsx.map