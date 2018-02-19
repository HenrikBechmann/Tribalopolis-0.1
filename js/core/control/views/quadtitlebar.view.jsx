// quadtitlebar.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
const QuadTitleBar = props => {
    let { infocus } = props;
    return (<div style={{
        height: '25px',
        backgroundColor: infocus ? 'lightgray' : 'darkgray',
        boxSizing: 'border-box',
        width: '100%',
        padding: '3px',
        borderRadius: '5px 5px 0 0',
        borderBottom: '1px solid silver',
    }}>
            {props.title}
        </div>);
};
export default QuadTitleBar;
//# sourceMappingURL=quadtitlebar.view.jsx.map