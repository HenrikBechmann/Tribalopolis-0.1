// categorieslist.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
import CategoryItem from './categoryitem.view';
let getCategoryItems = item => {
    let categories = item.categories.set;
    let order = item.categories.order;
    let catitems = [];
    for (let id of order) {
        let data = categories[id];
        let catitem = <CategoryItem key={id} id={id} data={data}/>;
        catitems.push(catitem);
    }
    return catitems;
};
const CategoriesList = props => {
    let { item } = props;
    let list = getCategoryItems(item);
    return <div style={{ paddingLeft: '6px' }}>
        {list}
    </div>;
};
export default CategoriesList;
//# sourceMappingURL=categorieslist.view.jsx.map