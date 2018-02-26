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
            <FontIcon style={{ position: 'absolute', top: '0', right: '0', marginTop: '3px', marginRight: '3px' }} className='material-icons'>zoom_out_map</FontIcon>
        <img style={{ verticalAlign: 'bottom' }} src={boxicon}/> {item.profile.name}
    </div>;
};
export default BoxHeader;
//# sourceMappingURL=boxheader.view.jsx.map