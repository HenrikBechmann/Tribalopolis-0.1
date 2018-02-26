// databox.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
import BoxHeader from './boxheader.view';
import BoxToolbar from './boxtoolbar.view';
import ProfileBar from './boxprofilebar.view';
import CategoriesBar from './boxcategoriesbar.view';
class DataBox extends React.Component {
    render() {
        // console.log('item',this.props.item)
        let frameStyle = {
            width: '280px',
            backgroundColor: 'lightblue',
            border: '1px solid silver',
            maxHeight: '96%',
            minHeight: '60%',
            padding: '3px',
            boxSizing: 'border-box',
            borderRadius: '8px',
            overflow: 'auto',
            marginRight: '16px',
        };
        return <div style={frameStyle}>
            <div>

                <BoxToolbar item={this.props.item}/>
                <BoxHeader item={this.props.item}/>
                <ProfileBar item={this.props.item}/>
                <CategoriesBar item={this.props.item}/>

            </div>
        </div>;
    }
}
export default DataBox;
//# sourceMappingURL=databox.view.jsx.map