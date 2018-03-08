// boxheader.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
import FontIcon from 'material-ui/FontIcon';
const ProfileBar = props => {
    let { node } = props;
    let styles = {
        width: '100%',
        border: '1px solid silver',
        borderRadius: '8px',
        padding: '3px',
        whitespace: 'nowrap',
        overflow: 'hidden',
        boxSizing: 'border-box',
        marginBottom: '1px',
        fontSize: 'larger',
        backgroundColor: '#f2f2f2',
    };
    return <div style={styles}>
        <FontIcon style={{
        verticalAlign: 'middle',
        float: 'right',
        transform: 'rotate(180deg)',
        marginRight: '4px',
    }} className='material-icons'>expand_less</FontIcon> 
        <FontIcon style={{ verticalAlign: 'middle' }} className='material-icons'>subject</FontIcon> 
        <span style={{ verticalAlign: 'middle' }}>Profile</span>
    </div>;
};
export default ProfileBar;
//# sourceMappingURL=profilebar.view.jsx.map