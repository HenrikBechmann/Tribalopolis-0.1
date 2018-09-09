// swapmenu.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
import ActionButton from '../common/actionbutton.view';
const OriginMenu = (props) => {
    let { stackpointer: pointer, stackdepth: depth } = props;
    return <div style={{
        position: 'absolute',
        top: '100%',
        border: '1px solid silver',
        borderRadius: '0 8px 8px 0',
        backgroundColor: 'lightgray',
        zIndex: 1,
        padding: '3px',
        opacity: 0.7,
        width: '32px',
    }}>
        <ActionButton icon='arrow_back' disabled={pointer == 0} action={props.decrementStackSelector}/>
        <ActionButton icon='arrow_forward' disabled={(pointer + 1) == depth} action={props.incrementStackSelector}/>
        <ActionButton icon='person'/>
        {false ? <ActionButton icon='weekend'/> : null}
    </div>;
};
export default OriginMenu;
//# sourceMappingURL=quadoriginmenu.view.jsx.map