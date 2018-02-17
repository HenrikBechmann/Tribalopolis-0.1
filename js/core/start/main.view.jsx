// copyright (c) 2016 Henrik Bechmann, Toronto, MIT Licence
// app.tsx
// display the app
import * as React from 'react';
import ReduxToastr from 'react-redux-toastr';
// import GlobalBarController from '../global/globalbar.controller'
// import { RoutesController } from './routes.controller'
import AppRouter from './approuter';
import routes from "./routes";
const MainView = ({ globalmessage, history }) => (<div>
        {globalmessage}

        <AppRouter>
            {routes}
        </AppRouter>

        <ReduxToastr timeOut={4000} newestOnTop={false} position="top-left"/>
    </div>);
export default MainView;
//# sourceMappingURL=main.view.jsx.map