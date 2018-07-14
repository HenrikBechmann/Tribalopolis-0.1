'use strict';
import * as React from 'react';
// import configureStore from '../utilities/configurestore'
// import Base from './base'
import { history } from './globaldataconfig.utility';
import coredata from '../actions/reducers';
let state = coredata; // get font-family for non material-ui components
let fontFamily = state.theme.fontFamily;
console.log(coredata, state);
// import { Provider } from 'react-redux'
import { DragDropContext } from 'react-dnd';
import DnDTouchBackend from 'react-dnd-touch-backend';
let DnDBackend = DnDTouchBackend({ enableMouseEvents: true });
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
const muiTheme = getMuiTheme();
import MainView from './main.view';
class Main extends React.Component {
    render() {
        let { globalmessage, version } = this.props;
        let mainviewstyle = {
            fontFamily,
        };
        return (<MuiThemeProvider muiTheme={muiTheme}>
                <MainView history={history} globalmessage={globalmessage} style={mainviewstyle}/>
            </MuiThemeProvider>);
    }
}
export default DragDropContext(DnDBackend)(Main);
//# sourceMappingURL=main.controller.jsx.map