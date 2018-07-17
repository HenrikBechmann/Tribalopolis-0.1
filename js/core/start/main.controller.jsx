'use strict';
import * as React from 'react';
import coredata from '../../data/coredata';
let state = coredata; // get font-family for non material-ui components
let fontFamily = state.theme.fontFamily;
import { DragDropContext } from 'react-dnd';
import DnDTouchBackend from 'react-dnd-touch-backend';
let DnDBackend = DnDTouchBackend({ enableMouseEvents: true });
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
const muiTheme = getMuiTheme();
import MainView from './main.view';
class Main extends React.Component {
    constructor() {
        super(...arguments);
        this.mainviewstyle = {
            fontFamily,
        };
    }
    render() {
        let { globalmessage, version } = this.props;
        return (<MuiThemeProvider muiTheme={muiTheme}>
                <MainView globalmessage={globalmessage} style={this.mainviewstyle}/>
            </MuiThemeProvider>);
    }
}
export default DragDropContext(DnDBackend)(Main);
//# sourceMappingURL=main.controller.jsx.map