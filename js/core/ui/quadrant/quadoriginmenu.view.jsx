// swapmenu.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
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
        <IconButton style={buttonStyle} disabled={pointer == 0} onClick={props.decrementStackSelector}>
            <Icon>
                arrow_back
            </Icon>
        </IconButton>
        <IconButton style={buttonStyle} disabled={(pointer + 1) == depth} onClick={props.incrementStackSelector}>
            <Icon>
                arrow_forward
            </Icon>
        </IconButton>
        <IconButton style={buttonStyle}>
            <Icon>
                person
            </Icon>
        </IconButton>
        {false ? <IconButton style={buttonStyle}>
            <Icon>
                weekend
            </Icon>
        </IconButton> : null}
    </div>;
};
export default OriginMenu;
//# sourceMappingURL=quadoriginmenu.view.jsx.map