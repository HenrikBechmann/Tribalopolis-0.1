// actionbutton.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
const ActionButton = (props) => {
    let defaultButtonStyle = {
        padding: '0',
        width: '24px',
        height: '24px',
        float: 'right',
        verticalAlign: 'bottom',
        marginRight: '3px'
    };
    let defaultIconStyle = {
    // ...defaultButtonStyle,
    };
    let { buttonStyle, iconStyle, action, icon, img, disabled } = props;
    let theButtonStyle = Object.assign({}, defaultButtonStyle, buttonStyle);
    let theIconStyle = Object.assign({}, defaultIconStyle, iconStyle);
    let iconcomponent = icon ? <FontIcon className='material-icons'>{icon}</FontIcon> :
        <img style={{ verticalAlign: 'middle' }} src={img}/>;
    let onClickVal = action
        ? () => { action(); }
        : () => { };
    return (<IconButton style={theButtonStyle} iconStyle={theIconStyle} onClick={onClickVal} disabled={disabled}>
            {iconcomponent}
        </IconButton>);
};
export default ActionButton;
//# sourceMappingURL=actionbutton.view.jsx.map