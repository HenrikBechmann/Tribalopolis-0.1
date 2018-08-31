// quadframe.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
const QuadSpaceFrame = props => {
    return (<div id="quadframe" style={{
        position: 'fixed',
        height: '100%',
        width: '100%',
        backgroundColor: 'silver',
    }}>
            {props.children}
        </div>);
};
export default QuadSpaceFrame;
//# sourceMappingURL=quadspaceframe.view.jsx.map