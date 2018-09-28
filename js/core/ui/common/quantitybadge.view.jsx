// quantitybadge.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import React from 'react';
const QuantityBadge = (props) => {
    let defaultstyles = {
        display: 'block',
        position: 'absolute',
        top: '-2px',
        left: '0',
        backgroundColor: 'palegoldenrod',
        height: '16px',
        borderRadius: '8px',
        minWidth: '16px',
        textAlign: 'center',
        color: 'black',
        fontSize: 'x-small',
        padding: '3px',
        boxSizing: 'border-box',
        opacity: .7,
    };
    let style = props.style || {};
    let badgestyles = Object.assign({}, defaultstyles, style);
    let { quantity } = props;
    return <div style={badgestyles}>{quantity}</div>;
};
export default QuantityBadge;
//# sourceMappingURL=quantitybadge.view.jsx.map