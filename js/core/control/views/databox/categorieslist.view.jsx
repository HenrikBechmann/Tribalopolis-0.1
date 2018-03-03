// categorieslist.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
import CategoryNode from './categorynode.view';
class CategoriesList extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            open: this.props.open
        };
        this.listelement = null;
        this.getCategoryNodes = node => {
            let categories = node.categories.set;
            let order = node.categories.order;
            let catitems = [];
            for (let id of order) {
                let data = categories[id];
                let catitem = <CategoryNode key={id} id={id} data={data}/>;
                catitems.push(catitem);
            }
            return <div ref={element => {
                this.listelement = element;
            }}>{catitems}</div>;
        };
    }
    render() {
        let { node } = this.props;
        let list = this.getCategoryNodes(node);
        return <div style={{
            paddingLeft: '6px',
            height: this.state.open ? 'auto' : '0',
            overflow: 'hidden',
        }}>
            {list}
        </div>;
    }
}
export default CategoriesList;
//# sourceMappingURL=categorieslist.view.jsx.map