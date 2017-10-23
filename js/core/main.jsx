import * as React from 'react';
import configureStore from './utilities/configurestore';
import Base from './bootstrap/base';
import AppRouter from './bootstrap/approuter';
import routes from "./routes";
// console.log(routes)
// import { autoLoginUser } from '../actions/actions'
const store = configureStore();
// TODO: implement login default for anonymous user
// TODO: work out permission system
// let { auth } = store.getState().login
// if (!auth.isAuthenticated) {
//     let token = localStorage.getItem('jsonwebtoken')
//     if (token) {
//         store.dispatch(autoLoginUser(token))
//     }
// }
//TODO: assign version to state (DEVELOPMENT|STAGING|PRODUCTION)
const Main = (props) => (<Base store={store} globalmessage={props.globalmessage}>
        <AppRouter>
            {routes}
        </AppRouter>
    </Base>);
export default Main;
//# sourceMappingURL=main.jsx.map