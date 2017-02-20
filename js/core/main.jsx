'use strict';
import * as React from 'react';
import Radium from 'radium';
import configureStore from './utilities/configurestore';
import Root from './containers/root';
// import { autoLoginUser } from '../actions/actions'
const store = configureStore();
// let { auth } = store.getState().login
// if (!auth.isAuthenticated) {
//     let token = localStorage.getItem('jsonwebtoken')
//     if (token) {
//         store.dispatch(autoLoginUser(token))
//     }
// }
let globalmessage = null;
//TODO: assign version to state (DEVELOPMENT|STAGING|PRODUCTION)
// <Root store={store} globalmessage={globalmessage} routes={routes}/>
const Main = () => (<Root store={store} globalmessage={globalmessage}/>);
export default Radium(Main);
//# sourceMappingURL=main.jsx.map