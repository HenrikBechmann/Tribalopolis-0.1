// quaddatadrawer.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import React from 'react';
import { createStyles } from '@material-ui/core/styles';
let styles = createStyles({
    root: {}
});
class QuadDataDrawer extends React.Component {
    constructor(props) {
        super(props);
        this.datadrawerelement = React.createRef();
    }
    render() {
        return (<div style={{
            width: '300px',
            backgroundColor: 'white',
            height: '100%',
            padding: '3px',
            position: 'absolute',
            right: '0',
            top: '0',
            zIndex: 1,
            transition: 'right .5s',
        }} ref={this.datadrawerelement} data-name='data-drawer' onClick={() => {
            this.datadrawerelement.current.style.right = '-310px';
        }}>
            data drawer
        </div>);
    }
}
export default QuadDataDrawer;
//# sourceMappingURL=quaddatadrawer.view.jsx.map