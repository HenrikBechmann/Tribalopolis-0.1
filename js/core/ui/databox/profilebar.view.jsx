// boxheader.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import React from 'react';
import Icon from '@material-ui/core/Icon';
import ActionButton from '../common/actionbutton.view';
const ProfileBar = props => {
    let { item } = props;
    let styles = {
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
    let iconStyle = () => ({
        transform: 'rotate(180deg)',
    });
    return <div style={styles}>

        <ActionButton icon='expand_less' iconStyle={iconStyle()}/>
        <Icon style={{ verticalAlign: 'middle' }}>subject</Icon> 
        <span style={{ verticalAlign: 'middle' }}>Profile</span>
    </div>;
};
export default ProfileBar;
//# sourceMappingURL=profilebar.view.jsx.map