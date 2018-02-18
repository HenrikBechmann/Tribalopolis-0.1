// quadbasket.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
const QuadOrigin = props => {
    return (<div style={{
        position: 'absolute',
        top: '24px',
        left: '0',
        width: '96px',
        height: '96px',
        backgroundColor: 'green',
        zIndex: 1,
        borderRadius: '50%',
    }}>
            {props.children}
        </div>);
};
export default QuadOrigin;
//# sourceMappingURL=quadorigin.view.jsx.map