// quadviewport.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import React from 'react';
const QuadViewport = props => {
    return (<div id="quadviewport" style={{
        position: 'absolute',
        top: '48px',
        left: '0',
        right: '0',
        bottom: '25px',
        backgroundColor: 'tan',
        overflow: 'hidden',
    }}>
            {props.children}
        </div>);
};
export default QuadViewport;
//# sourceMappingURL=quadviewport.view.jsx.map