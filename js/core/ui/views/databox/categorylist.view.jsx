// categorieslist.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
import CategoryItem from './categoryitem.view';
import Lister from 'react-list';
class CategoriesList extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            highlightrefuid: null,
            links: this.props.listobject.links,
        };
        this.getListItem = this.props.getListItem;
        this.expandCategory = (dataref) => {
            return (domSource) => {
                this.props.expandCategory(dataref, domSource);
            };
        };
        // getListItems = listobject => {
        //     let { getListItem } = this.props
        //     let { links } = listobject
        //     let catitems = []
        //     for (let dataref of links) {
        //         let catitem = this.getListComponent(dataref)
        //         catitems.push(catitem)
        //     }
        //     return <div>{catitems}</div>
        // }
        this.itemRenderer = (index, key) => {
            return this.getListComponent(this.state.links[index], key);
        };
        this.getListComponent = (dataref, key) => {
            let data = this.getListItem(dataref);
            let highlight = (dataref.uid === this.state.highlightrefuid);
            let catitem = <CategoryItem key={key} uid={dataref.uid} data={data} expandCategory={this.expandCategory(dataref)} highlight={highlight} highlightItem={this.props.highlightItem}/>;
            return catitem;
        };
    }
    componentDidUpdate() {
        if (!this.props.highlightrefuid)
            return;
        this.setState({
            highlightrefuid: this.props.highlightrefuid,
        }, () => {
            this.setState({
                highlightrefuid: null
            });
        });
    }
    render() {
        return <Lister itemRenderer={this.itemRenderer} length={this.state.links.length} type='uniform'/>;
    }
}
export default CategoriesList;
//# sourceMappingURL=categorylist.view.jsx.map