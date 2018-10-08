// quaddatadrawer.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import React from 'react';
import { withStyles, createStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
let styles = createStyles({
    root: {
        backgroundColor: 'white',
        height: '100%',
        padding: '3px',
        position: 'absolute',
        top: '0',
        overflow: 'auto',
        zIndex: 1,
        transition: 'right .5s',
    },
    button: {
        float: 'right',
    }
});
class QuadDataDrawer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 300,
            right: -310,
        };
        this.assertOpen = (open) => {
            let right;
            if (open) {
                right = 0;
            }
            else {
                right = -(this.state.width + 10);
            }
            this.setState({
                right,
            });
        };
        this.datadrawerelement = React.createRef();
    }
    componentDidMount() {
        this.assertOpen(this.props.open);
    }
    componentDidUpdate(prevProps) {
        if (prevProps.open != this.props.open) {
            this.assertOpen(this.props.open);
        }
    }
    render() {
        let { classes } = this.props;
        return (<div style={{
            width: this.state.width + 'px',
            right: this.state.right + 'px',
        }} className={classes.root} ref={this.datadrawerelement} data-name='data-drawer'>
            <IconButton className={classes.button} onClick={this.props.handleClose}>
                <Icon>close</Icon>
            </IconButton>
            {this.props.children}
        </div>);
    }
}
export default withStyles(styles)(QuadDataDrawer);
//# sourceMappingURL=quaddatadrawer.view.jsx.map