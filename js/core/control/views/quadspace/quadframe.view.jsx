// quadframe.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
const QuadFrame = props => {
    return (<div id="quadframe" style={{ position: 'fixed', height: '100%', width: '100%' }}>
            {props.children}
        </div>);
};
export default QuadFrame;
//# sourceMappingURL=quadframe.view.jsx.map