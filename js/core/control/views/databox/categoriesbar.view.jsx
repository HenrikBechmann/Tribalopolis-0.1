// boxheader.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
import FontIcon from 'material-ui/FontIcon';
import CategoriesList from './categorieslist.view';
const CategoriesBar = props => {
    let { node } = props;
    let styles = {
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
    return <div>
        <div style={styles}>
            <FontIcon style={{ verticalAlign: 'middle', float: 'right' }} className='material-icons'>expand_less</FontIcon> 
            <FontIcon style={{ verticalAlign: 'middle' }} className='material-icons'>list</FontIcon> 
            <span style={{ verticalAlign: 'middle' }}>Activity Categories {`(${node.categories.order.length})`}</span>
        </div>
        <CategoriesList node={node}/>
    </div>;
};
export default CategoriesBar;
//# sourceMappingURL=categoriesbar.view.jsx.map