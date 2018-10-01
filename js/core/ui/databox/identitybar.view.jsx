// boxheader.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import React from 'react';
import ActionButton from '../common/actionbutton.view';
import { withStyles, createStyles } from '@material-ui/core/styles';
const styles = createStyles({
    root: {
        position: 'relative',
        width: '100%',
        border: '1px solid transparent',
        borderRadius: '8px',
        padding: '3px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        boxSizing: 'border-box',
        marginBottom: '1px',
        fontSize: 'larger',
        backgroundColor: '#f2f2f2',
    },
    avatar: {
        verticalAlign: 'middle',
        width: '32px',
        margin: '0 3px'
    },
    name: {
        display: 'inline-block',
        verticalAlign: 'middle',
        textOverflow: 'ellipsis',
        maxWidth: '63%',
        overflow: 'hidden',
    },
});
const IdentityBar = props => {
    let { item } = props;
    let avatar = '/public/avatars/henrik_in_circle.png';
    let { classes } = props;
    return <div className={classes.root}>
        {false && <ActionButton icon='lock'/>}
        <ActionButton icon='expand_more'/>
        <img className={classes.avatar} src={avatar}/> 
        <div className={classes.name}>
            {item.properties.name.fullname}
        </div>
    </div>;
};
export default withStyles(styles)(IdentityBar);
//# sourceMappingURL=identitybar.view.jsx.map