// quadtitlebar.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import React from 'react';
import { withStyles, createStyles } from '@material-ui/core/styles';
const styles = createStyles({
    root: {
        position: 'relative',
        height: '33px',
        backgroundColor: 'white',
        boxSizing: 'border-box',
        width: '100%',
        borderRadius: '5px 5px 0 0',
        borderBottom: '1px solid silver',
        overflow: 'hidden',
        fontSize: 'smaller',
    },
    aliasbox: {
        position: 'absolute',
        top: '0',
        left: '0',
        zIndex: 3,
        backgroundColor: 'white',
        border: '1px solid gray',
        boxSizing: 'border-box',
        height: '24px',
        width: '24px',
        fontSize: '20px',
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'gray',
    },
    titlebox: {
        position: 'absolute',
        top: '0',
        width: '100%',
        height: '42px',
        overflow: 'auto',
        display: 'flex',
        flexWrap: 'nowrap',
        boxSizing: 'border-box',
        padding: '3px 0 0 30px',
    },
    titlewrap: {
        whiteSpace: 'nowrap',
    },
});
class QuadContextBar extends React.Component {
    render() {
        let { quadidentifier: alias, classes, datastack, stackpointer, title } = this.props;
        // console.log('datastack, stackpointer', datastack, stackpointer)
        return (<div className={classes.root}>
            <div className={classes.aliasbox}>
                {alias} 
            </div>
            <div className={classes.titlebox}>
                <div className={classes.titlewrap}>
                    {title}
                </div>
            </div>
        </div>);
    }
}
export default withStyles(styles)(QuadContextBar);
//# sourceMappingURL=quadcontextbar.view.jsx.map