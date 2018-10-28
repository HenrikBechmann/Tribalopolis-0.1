// quaddatapane.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import React from 'react';
import { withStyles, createStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
const styles = createStyles({
    root: {
        position: 'absolute',
        top: '15px',
        right: '6px',
        bottom: '6px',
        left: '6px',
        overflow: 'auto',
    },
    content: {
        padding: '3px',
    }
});
class BuildDataPane extends React.Component {
    render() {
        const { classes, drawerDataPackage } = this.props;
        // console.log('props',this.props)
        return <Paper className={classes.root}>
            <div className={classes.content}>
                Build Data shelf {drawerDataPackage ? drawerDataPackage.opcode : null}
            </div>
        </Paper>;
    }
}
export default withStyles(styles)(BuildDataPane);
//# sourceMappingURL=builddatapane.view.jsx.map