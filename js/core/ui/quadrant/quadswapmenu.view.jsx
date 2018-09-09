// swapmenu.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import React from 'react';
import ActionButton from '../common/actionbutton.view';
const SwapMenu = ({ quadrantPosition, handleSwap }) => {
    let tilt = null;
    if (quadrantPosition == 'topleft' || quadrantPosition == 'bottomright') {
        tilt = '-45deg';
    }
    else {
        tilt = '45deg';
    }
    return <div style={{
        position: 'absolute',
        right: '0',
        top: '0',
        border: '1px solid silver',
        borderRadius: '0 0 0 8px',
        backgroundColor: 'lightgray',
        zIndex: 1,
        padding: '3px',
        opacity: 0.7,
    }}>
        <ActionButton iconStyle={{ color: 'green' }} icon='swap_vert' action={() => {
        handleSwap(quadrantPosition, 'vertical');
    }}/>
        <ActionButton iconStyle={{ color: 'green', transform: `rotate(${tilt})` }} icon='swap_vert' action={() => {
        handleSwap(quadrantPosition, 'diagonal');
    }}/>
        <ActionButton iconStyle={{ color: 'green' }} icon='swap_horiz' action={() => {
        handleSwap(quadrantPosition, 'horizontal');
    }}/>
    </div>;
};
// style = {{color:'green',marginRight:'8px',border:'1px solid silver',borderRadius:'50%',}} 
export default SwapMenu;
//# sourceMappingURL=quadswapmenu.view.jsx.map