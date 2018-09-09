// quadtitlebar.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import React from 'react';
import Icon from '@material-ui/core/Icon';
const QuadStatusBar = props => {
    return (<div style={{
        position: 'absolute',
        height: '25px',
        backgroundColor: 'paleturquoise',
        boxSizing: 'border-box',
        width: '100%',
        borderRadius: '0 0 5px 5px',
        borderTop: '2px solid gray',
        overflow: 'hidden',
        fontSize: 'smaller',
        bottom: '0',
    }}>
            <div style={{
        position: 'absolute',
        top: '-4px',
        right: '0',
        zIndex: 3,
        backgroundColor: 'lightgray',
        border: '1px solid silver',
        boxSizing: 'border-box',
    }}> 
                <Icon>delete</Icon>
            </div>
            <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        zIndex: 3,
        backgroundColor: 'lightgray',
        border: '1px solid gray',
        boxSizing: 'border-box',
    }}>
                <Icon>view_list</Icon>
            </div>
            <div style={{
        position: 'absolute',
        top: '0',
        width: '100%',
        height: '42px',
        overflow: 'auto',
        display: 'flex',
        flexWrap: 'nowrap',
        boxSizing: 'border-box',
        padding: '3px 0 0 30px',
    }}>
                <div style={{ whiteSpace: 'nowrap' }}>
                    {props.status}
                </div>
            </div>
        </div>);
};
export default QuadStatusBar;
//# sourceMappingURL=quadstatusbar.view.jsx.map