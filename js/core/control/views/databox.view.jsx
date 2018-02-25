// databox.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
class DataBox extends React.Component {
    render() {
        let frameStyle = {
            // float:'left',
            // float:'left',
            // position:'relative',
            // display:'inline-block',
            // display:'flex',
            // minWidth:'280px',
            width: '280px',
            backgroundColor: 'lightblue',
            border: '1px solid silver',
            maxHeight: '96%',
            minHeight: '60%',
            padding: '3px',
            // boxShadow:'6px 6px 4px lightgray',
            boxSizing: 'border-box',
            borderRadius: '8px',
            overflow: 'auto',
            marginRight: '16px',
        };
        return <div style={frameStyle}>
            <div style={{ width: '100%', borderRadius: '6px' }}>
                data box
            </div>
        </div>;
    }
}
export default DataBox;
//# sourceMappingURL=databox.view.jsx.map