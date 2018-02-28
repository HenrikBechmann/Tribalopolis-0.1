// boxheader.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
import FontIcon from 'material-ui/FontIcon';
const BoxHeader = props => {
    let { item } = props;
    let boxicon = '/public/icons/databox.svg';
    let styles = {
        position: 'relative',
        width: '100%',
        border: '1px solid silver',
        borderRadius: '8px',
        padding: '3px',
        whitespace: 'nowrap',
        overflow: 'hidden',
        boxSizing: 'border-box',
        marginBottom: '3px',
        fontSize: 'larger',
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
        border: '1px solid silver',
    }}>
            <FontIcon className='material-icons'>zoom_out_map</FontIcon>
        </div>
        <img style={{ verticalAlign: 'bottom' }} src={boxicon}/> {item.profile.name}
    </div>;
};
export default BoxHeader;
//# sourceMappingURL=header.view.jsx.map