// swapmenu.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
const OriginMenu = (props) => {
    let { stackpointer: pointer, stackdepth: depth } = props;
    let buttonStyle = { padding: '0', width: '24px', height: '24px' };
    let iconStyle = {
        marginBottom: '4px',
        border: '1px solid silver',
        borderRadius: '50%',
    };
    return <div style={{
        position: 'absolute',
        top: '100%',
        border: '1px solid silver',
        borderRadius: '0 0 8px 0',
        backgroundColor: 'lightgray',
        zIndex: 1,
        padding: '3px',
        opacity: 0.7,
        width: '26px',
    }}>
        <IconButton style={buttonStyle} iconStyle={iconStyle} disabled={pointer == 0} onClick={props.decrementStackSelector}>
            <FontIcon color='green' className='material-icons'>
                arrow_back
            </FontIcon>
        </IconButton>
        <IconButton style={buttonStyle} iconStyle={iconStyle} disabled={(pointer + 1) == depth} onClick={props.incrementStackSelector}>
            <FontIcon color='green' className='material-icons'>
                arrow_forward
            </FontIcon>
        </IconButton>
        <IconButton style={buttonStyle} iconStyle={iconStyle}>
            <FontIcon color='green' className='material-icons'>
                person
            </FontIcon>
        </IconButton>
        <IconButton style={buttonStyle} iconStyle={iconStyle}>
            <FontIcon color='green' className='material-icons'>
                weekend
            </FontIcon>
        </IconButton>
    </div>;
};
export default OriginMenu;
//# sourceMappingURL=quadoriginmenu.view.jsx.map