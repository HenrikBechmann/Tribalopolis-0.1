// quadbasket.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
import OriginMenu from './quadoriginmenu.view';
import QuantityBadge from '../common/quantitybadge.view';
const QuadOriginBase = props => {
    return (<div style={{
        position: 'absolute',
        top: '24px',
        left: '0',
        width: '40px',
        height: '60px',
        backgroundColor: 'green',
        borderRadius: '8px',
        zIndex: 2,
    }} ref={props.forwardedRef}>
            <QuantityBadge quantity={props.stackdepth}/>
            <QuantityBadge quantity={props.stackpointer + 1} style={{
        top: 'auto',
        bottom: '0',
        right: 'auto',
        left: '0',
        backgroundColor: 'red',
        color: 'white',
    }}/>
            <div style={{
        position: 'absolute',
        margin: 'auto',
        top: '10px',
        left: '0',
        opacity: .3,
        width: '100%',
        textAlign: 'center',
    }}>
                <img style={{ width: '40px' }} src='/public/icons/OriginStack.svg'/>
            </div>
            <OriginMenu stackdepth={props.stackdepth} stackpointer={props.stackpointer} incrementStackSelector={props.incrementStackSelector} decrementStackSelector={props.decrementStackSelector}/>
        </div>);
};
const QuadOrigin = React.forwardRef((props, ref) => {
    return <QuadOriginBase {...props} forwardedRef={ref}/>;
});
export default QuadOrigin;
//# sourceMappingURL=quadorigin.view.jsx.map