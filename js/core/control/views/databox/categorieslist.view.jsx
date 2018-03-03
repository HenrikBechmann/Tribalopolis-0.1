// categorieslist.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
import CategoryNode from './categorynode.view';
class CategoriesList extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            open: this.props.open,
            listheight: this.props.open ? 'auto' : '0',
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
    componentWillReceiveProps(nextProps) {
        let { open: willbeopen } = nextProps;
        if (willbeopen !== this.state.open) {
            let targetheight = null;
            let startheight = null;
            let finalheight = null;
            let subheight = this.listelement.offsetHeight + 'px';
            if (this.state.open) {
                targetheight = '0',
                    startheight = subheight;
                finalheight = '0';
            }
            else {
                targetheight = subheight;
                startheight = '0';
                finalheight = 'auto';
            }
            this.setState({
                listheight: startheight
            }, () => {
                setTimeout(() => {
                    this.setState({
                        listheight: targetheight,
                        open: willbeopen,
                    }, () => {
                        setTimeout(() => {
                            this.setState({
                                listheight: finalheight,
                            });
                        }, 600);
                    });
                }, 50);
            });
            this.setState({
                open,
            });
        }
    }
    render() {
        let { node } = this.props;
        let list = this.getCategoryNodes(node);
        return <div style={{
            paddingLeft: '6px',
            height: this.state.listheight,
            overflow: 'hidden',
            transition: 'height 0.5s ease-out'
        }}>
            {list}
        </div>;
    }
}
export default CategoriesList;
//# sourceMappingURL=categorieslist.view.jsx.map