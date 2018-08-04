// categorieslist.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
import CategoryItem from './categoryitem.view';
class CategoriesList extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            highlightrefuid: null,
        };
        this.listelement = null;
        this.expandCategory = (ref) => {
            return () => {
                this.props.expandCategory(ref);
            };
        };
        this.getListItems = listobject => {
            let { getListItem } = this.props;
            let { links } = listobject;
            let catitems = [];
            for (let ref of links) {
                let data = getListItem(ref);
                let highlight = (ref.uid === this.state.highlightrefuid);
                let catitem = <CategoryItem key={ref.uid} uid={ref.uid} data={data} expandCategory={this.expandCategory(ref)} highlight={highlight} highlightItem={this.props.highlightItem}/>;
                catitems.push(catitem);
            }
            return <div ref={element => {
                this.listelement = element;
            }}>{catitems}</div>;
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
        let { listobject } = this.props;
        let listitems = this.getListItems(listobject);
        return <div style={{
            paddingLeft: '6px',
            paddingBottom: '32px',
        }}>
            {listitems}
        </div>;
    }
}
export default CategoriesList;
//# sourceMappingURL=categorylist.view.jsx.map