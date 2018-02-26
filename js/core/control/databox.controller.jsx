// databox.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
import BoxHeader from './views/databox/boxheader.view';
import BoxToolbar from './views/databox/boxtoolbar.view';
import ProfileBar from './views/databox/boxprofilebar.view';
import ProfileForm from './views/databox/profileform.view';
import CategoriesBar from './views/databox/boxcategoriesbar.view';
import CategoriesList from './views/databox/categorieslist.view';
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
            marginRight: '16px',
            fontSize: 'smaller',
        };
        let { item } = this.props;
        return <div style={frameStyle}>
            <BoxToolbar item={item}/>
            <BoxHeader item={item}/>
            <div style={{
            overflow: 'auto',
            height: 'calc(100% - 70px)'
        }}>
                <div>
                    <ProfileBar item={item}/>
                    <ProfileForm item={item}/>
                    <CategoriesBar item={item}/>
                    <CategoriesList item={item}/>
                </div>

            </div>
        </div>;
    }
}
export default DataBox;
//# sourceMappingURL=databox.controller.jsx.map