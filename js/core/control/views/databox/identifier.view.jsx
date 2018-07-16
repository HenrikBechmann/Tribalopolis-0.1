// boxheader.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
import FontIcon from 'material-ui/FontIcon';
const BoxHeader = props => {
    let { node } = props;
    let boxicon = '/public/icons/databox.svg';
    let styles = {
        position: 'relative',
        width: '100%',
        border: '1px solid transparent',
        borderRadius: '8px',
        padding: '3px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        boxSizing: 'border-box',
        marginBottom: '1px',
        fontSize: 'larger',
        backgroundColor: '#f2f2f2',
    };
    return <div style={styles}>
        <div style={{
        position: 'absolute',
        top: '0',
        right: '0',
        marginRight: '3px',
        padding: '3px',
        boxSizing: 'border-box',
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        border: '1px solid transparent',
    }}>
            <FontIcon className='material-icons'>zoom_out_map</FontIcon>
        </div>
        <img style={{ verticalAlign: 'bottom' }} src={boxicon}/> {node.profile.name}
    </div>;
};
export default BoxHeader;
//# sourceMappingURL=identifier.view.jsx.map