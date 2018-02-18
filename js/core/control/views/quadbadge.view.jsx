// quadbadge.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
const QuadBadge = props => {
    let defaultstyles = {
        display: 'inline-block',
        position: 'relative',
        top: '-2px',
        left: '0',
        backgroundColor: '#ff4081',
        height: '16px',
        borderRadius: '8px',
        minWidth: '16px',
        textAlign: 'center',
        color: 'white',
        fontSize: 'x-small',
        padding: '3px',
        boxSizing: 'border-box',
        zIndex: 1,
    };
    let style = props.style || {};
    let badgestyles = Object.assign({}, defaultstyles, style);
    let { quantity } = props;
    return <div style={badgestyles}>{quantity}</div>;
};
export default QuadBadge;
//# sourceMappingURL=quadbadge.view.jsx.map