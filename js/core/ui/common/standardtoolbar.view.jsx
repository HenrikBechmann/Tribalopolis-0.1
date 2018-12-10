// standardtoolbar.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import React from 'react';
import { withStyles, createStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import UserDataContext from '../../services/userdata.context';
import ToolsStrip from './toolsstrip.view';
const styles = createStyles({
    toolstrip: {
        display: 'inline-block',
        verticalAlign: 'middle',
        marginLeft: '12px',
        borderLeft: '1px solid gray',
    },
    name: {
        display: 'inline',
        color: 'dimgray',
        fontSize: 'smaller',
        fontStyle: 'italic',
    },
    spacer: {
        height: '48px',
        width: '100%',
    }
});
const StandardToolbar = (props) => {
    let { classes } = props;
    return (<div>
            <UserDataContext.Consumer>
            {userdata => (<ToolsStrip user={userdata ? userdata.login : null} childrenposition='end'>
                    <div className={classes.toolstrip}>
                        <Icon style={{ margin: '0 8px 0 8px', verticalAlign: 'middle' }}>
                            <img src='/public/icons/fire.svg'/>
                        </Icon>
                        <div className={classes.name}>
                            Tribalopolis is a virtual city of tribes
                        </div>
                    </div>
                </ToolsStrip>)}
            </UserDataContext.Consumer>
            <div className={classes.spacer}></div>
        </div>);
};
export default withStyles(styles)(StandardToolbar);
//# sourceMappingURL=standardtoolbar.view.jsx.map