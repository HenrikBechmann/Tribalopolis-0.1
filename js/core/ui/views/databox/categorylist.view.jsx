// categorieslist.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
import CategoryItem from './categoryitem.view';
class CategoriesList extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            refid: null,
        };
        this.listelement = null;
        this.expandCategory = (ref) => {
            return () => {
                this.props.expandCategory(ref);
            };
        };
        this.getListItems = list => {
            let { getListItem } = this.props;
            let { links } = list;
            let catitems = [];
            for (let ref of links) {
                let data = getListItem(ref);
                let highlight = (ref.id === this.state.refid);
                // console.log('highlight vars',ref.id,this.state.refid)
                let catitem = <CategoryItem key={ref.id} id={ref.id} data={data} expandCategory={this.expandCategory(ref)} highlight={highlight} highlightItem={this.props.highlightItem}/>;
                catitems.push(catitem);
            }
            return <div ref={element => {
                this.listelement = element;
            }}>{catitems}</div>;
        };
    }
    componentDidUpdate() {
        // console.log('list did update',this.props)
        if (!this.props.refid)
            return;
        this.setState({
            refid: this.props.refid,
        }, () => {
            this.setState({
                refid: null
            });
        });
    }
    render() {
        let { list: listobject } = this.props;
        let listitems = this.getListItems(listobject);
        return <div style={{
            paddingLeft: '6px',
        }}>
            {listitems}
        </div>;
    }
}
export default CategoriesList;
//# sourceMappingURL=categorylist.view.jsx.map