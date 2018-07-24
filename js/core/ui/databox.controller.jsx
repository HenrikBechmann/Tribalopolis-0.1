// databox.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
import BoxIdentifier from './views/databox/identitybar.view';
import BoxTypebar from './views/databox/typebar.view';
import CategoriesBar from './views/databox/categoriesbar.view';
import CategoriesList from './views/databox/categorylist.view';
class DataBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            opacity: 0,
            boxconfig: this.props.boxConfig,
            refid: null,
            open: true,
        };
        this.expandCategory = (ref) => {
            let boxConfig = this.state.boxconfig;
            boxConfig.liststack.push(ref);
            this.setState({
                boxConfig,
            });
        };
        this.collapseCategory = () => {
            let boxConfig = this.state.boxconfig;
            let ref = boxConfig.liststack.pop();
            this.setState({
                boxConfig,
                refid: ref.id,
            }, () => {
                this.setState({
                    refid: null
                });
            });
        };
        this.highlightItem = (itemref) => {
            let itemelement = itemref.current;
            let scrollelement = this.scrollelementref.current;
            let clientoffset = 0;
            let element = itemelement;
            while (element && (element.getAttribute('data-marker') != 'databox-scrollbox')) {
                clientoffset += element.offsetTop;
                console.log('marker', element.getAttribute('data-marker'), clientoffset);
                element = element.offsetParent;
                console.log('next element', element.getAttribute('data-marker'), element);
            }
            console.log('do highlight item', itemref, itemelement, scrollelement, element, clientoffset);
        };
        this.scrollelementref = React.createRef();
    }
    componentDidMount() {
        this.setState({
            opacity: 1,
        });
    }
    render() {
        // console.log('item',this.props.item)
        let opacity = this.state.opacity;
        let frameStyle = {
            width: '300px',
            backgroundColor: 'white',
            border: '1px solid silver',
            maxHeight: '96%',
            minHeight: '60%',
            padding: '3px',
            boxSizing: 'border-box',
            borderRadius: '8px',
            marginRight: '16px',
            fontSize: 'smaller',
            opacity: opacity,
            transition: 'opacity .5s ease-out',
            overflow: 'hidden',
        };
        let { item, getListItem } = this.props;
        let listStack = this.state.boxconfig.liststack;
        let { listref: listroot } = item;
        let listref;
        if (listStack.length) {
            listref = listStack[listStack.length - 1];
        }
        else {
            listref = listroot;
        }
        let list = getListItem(listref);
        return <div style={frameStyle}>
            <BoxTypebar item={item}/>
            <BoxIdentifier item={item}/>
            <div style={{
            height: 'calc(100% - 70px)',
            position: 'relative',
        }}>
                <CategoriesBar item={item} refid={this.state.refid} getListItem={this.props.getListItem} listStack={this.state.boxconfig.liststack} collapseCategory={this.collapseCategory}/>
                <div style={{ height: 'calc(100% - 28px)', overflow: 'auto', position: 'relative' }}>
                    <CategoriesList refid={this.props.refid} open={this.state.open} list={list} highlightItem={this.highlightItem} getListItem={this.props.getListItem} expandCategory={this.expandCategory}/>
                </div>
            </div>
        </div>;
    }
}
// <ProfileBar item = {item} />
// <ProfileForm item = {item} />
// <ScanBar item = {item} />
export default DataBox;
//# sourceMappingURL=databox.controller.jsx.map