// copyright (c) 2016 Henrik Bechmann, Toronto, MIT Licence
// root.tsx
import * as React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import ReduxToastr from 'react-redux-toastr';
// import Radium from 'radium'
// import { render } from 'react-dom'
import { Provider } from 'react-redux';
const Base = ({ store, globalmessage }) => (<MuiThemeProvider muiTheme={getMuiTheme()}>
        <Provider store={store}>
            {this.props.children}
            <ReduxToastr timeOut={4000} newestOnTop={false} position="top-left"/>
        </Provider>
    </MuiThemeProvider>);
export default Base;
//# sourceMappingURL=base.jsx.map