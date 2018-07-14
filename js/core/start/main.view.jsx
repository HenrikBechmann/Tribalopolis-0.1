// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
// main.view.tsx
// display the app
'use strict';
import * as React from 'react';
// import ReduxToastr from 'react-redux-toastr'
// import GlobalBarController from '../global/globalbar.controller'
// import { RoutesController } from './routes.controller'
import { AppRouter } from './approuter';
const MainView = ({ globalmessage, history, style }) => (<div style={style}>
        {globalmessage}

        <AppRouter history={history}/>

    </div>);
export default MainView;
//# sourceMappingURL=main.view.jsx.map