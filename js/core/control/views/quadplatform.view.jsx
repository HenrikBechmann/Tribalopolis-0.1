// quadplatform.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
const QuadPlatform = props => {
    let currentquad = props.currentquad || 'topleft';
    let top = 'auto';
    let left = 'auto';
    let right = 'auto';
    let bottom = 'auto';
    switch (currentquad) {
        case 'topleft': {
            top = '0';
            left = '0';
            break;
        }
        case 'topright': {
            top = '0';
            right = '0';
            break;
        }
        case 'bottomleft': {
            bottom = '0';
            left = '0';
            break;
        }
        case 'bottomright': {
            bottom = '0';
            right = '0';
            break;
        }
    }
    return (<div id="quadplatform" style={{
        position: 'absolute',
        width: '200%',
        height: '200%',
        top,
        left,
        bottom,
        right,
        transition: 'top 1s ease-in,left 1s ease-in,bottom 1s ease-in,right 1s ease-in'
    }}>
            {props.children}
        </div>);
};
export default QuadPlatform;
//# sourceMappingURL=quadplatform.view.jsx.map