// categoryitem.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
import FontIcon from 'material-ui/FontIcon';
const CategoryItem = props => {
    let { id, data } = props;
    let { name, count } = data;
    return <div style={{
        padding: '3px',
    }}>
        <FontIcon style={{ verticalAlign: 'middle' }} className='material-icons'>list</FontIcon> {name}
    </div>;
};
export default CategoryItem;
//# sourceMappingURL=categoryitem.view.jsx.map