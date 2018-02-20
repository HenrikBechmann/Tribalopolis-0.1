// quadtitlebar.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
import FontIcon from 'material-ui/FontIcon';
const QuadStatusBar = props => {
    return (<div style={{
        position: 'absolute',
        height: '25px',
        boxSizing: 'border-box',
        backgroundColor: 'paleturquoise',
        width: '100%',
        bottom: '0',
        padding: '3px',
        borderRadius: '0 0 5px 5px',
        borderTop: '2px solid gray',
    }}>
            <div style={{
        position: 'absolute',
        top: '-4px',
        right: '0',
        backgroundColor: 'lightgray',
        border: '1px solid silver',
        overflow: 'hidden',
    }}> 
                <FontIcon className='material-icons'>delete</FontIcon>
            </div>
            <div style={{ float: 'left', position: 'relative', top: '-3px' }}>
                <FontIcon className='material-icons'>view_list</FontIcon>
            </div>
            <div style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
                {props.status}
            </div>
        </div>);
};
export default QuadStatusBar;
//# sourceMappingURL=quadstatusbar.view.jsx.map