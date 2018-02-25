// boxtoolbar.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
import FontIcon from 'material-ui/FontIcon';
const BoxToolbar = props => {
    let styles = {
        width: '100%',
        borderRadius: '8px',
        padding: '3px',
        whitespace: 'nowrap',
        overflow: 'hidden',
        boxSizing: 'border-box',
    };
    return <div style={styles}>

        <div style={{
        padding: '5px 0 0 3px',
        boxSizing: 'border-box',
        width: '32px',
        height: '32px',
        display: 'inline-block',
        borderRadius: '50%',
        backgroundColor: 'rgba(192,192,192,0.5)',
    }}> 
            <img src='/public/icons/ic_splay_24px.svg'/>
        </div>
        <div style={{
        padding: '3px',
        boxSizing: 'border-box',
        width: '32px',
        height: '32px',
        display: 'inline-block',
        float: 'right',
        borderRadius: '50%',
        backgroundColor: 'rgba(192,192,192,0.5)',
    }}>
            <FontIcon className='material-icons'>zoom_out_map</FontIcon>
        </div>

    </div>;
};
export default BoxToolbar;
//# sourceMappingURL=boxtoolbar.view.jsx.map