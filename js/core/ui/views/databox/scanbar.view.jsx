// scanbar.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
import FontIcon from 'material-ui/FontIcon';
import ActionButton from '../common/actionbutton.view';
const ScanBar = props => {
    let { item } = props;
    let barStyle = {
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
    };
    let buttonStyle = {
        padding: '0',
        width: '24px',
        height: '24px',
        float: 'right',
        marginRight: '4px',
    };
    let iconStyle = {
        border: '1px solid transparent',
        borderRadius: '50%',
        verticalAlign: 'middle',
    };
    return <div>
        <div style={barStyle}>
            <ActionButton icon='close' disabled/>
            <ActionButton icon='play_arrow' iconStyle={{ color: 'green' }}/>
            <ActionButton icon='settings' iconStyle={{ color: 'green' }}/>
            <FontIcon style={{ verticalAlign: 'middle' }} className='material-icons'>list</FontIcon> 
            <span style={{ verticalAlign: 'middle' }}>Scan Links</span>
        </div>
    </div>;
};
export default ScanBar;
//# sourceMappingURL=scanbar.view.jsx.map