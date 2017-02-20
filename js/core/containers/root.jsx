// copyright (c) 2016 Henrik Bechmann, Toronto, MIT Licence
// root.tsx
import * as React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import ReduxToastr from 'react-redux-toastr';
// import { render } from 'react-dom'
import { Provider } from 'react-redux';
const MainBar = (props) => (<div style={props.style}>Toolbar</div>);
let styles = {
    origin: {
        float: 'left',
        minWidth: '60px',
        minHeight: '60px',
        border: '1px solid silver',
        backgroundColor: 'lightblue',
    },
    toolbar: { backgroundColor: 'lightgray', minHeight: '40px' },
    title: { backgroundColor: 'palegoldenrod', minHeight: '16px' },
    status: { backgroundColor: 'palegoldenrod', minHeight: '16px' },
    graph: { minHeight: '300px' },
    list: { backgroundColor: 'lightgreen', minHeight: '120px' },
};
const Root = ({ store, globalmessage }) => (<MuiThemeProvider muiTheme={getMuiTheme()}>
        <Provider store={store}>
            <div>
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
                
                <ReduxToastr timeOut={4000} newestOnTop={false} position="top-left"/>
            </div>
        </Provider>
    </MuiThemeProvider>);
export default Root;
//# sourceMappingURL=root.jsx.map