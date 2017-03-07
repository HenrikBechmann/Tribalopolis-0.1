import * as React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import ReduxToastr from 'react-redux-toastr'
import { Provider } from 'react-redux'

// TODO copy muiTheme to global state at this point

const Base = (props) => (
    <MuiThemeProvider muiTheme = {getMuiTheme()}>
        <Provider store={ props.store }>
            <div>
                {props.globalmessage?<div>{props.globalmessage}</div>:null}
                {props.children}
                <ReduxToastr
                      timeOut={4000}
                      newestOnTop={false}
                      position="top-left"/>
            </div>
        </Provider>
    </MuiThemeProvider>
)

export default Base
