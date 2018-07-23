// databox.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
import BoxIdentifier from './views/databox/identitybar.view';
import BoxTypebar from './views/databox/typebar.view';
import CategoriesBar from './views/databox/categoriesbar.view';
class DataBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            opacity: 0,
            boxconfig: this.props.boxConfig,
            refid: null,
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
            console.log('do highlight item', itemelement, scrollelement);
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
        let { item } = this.props;
        return <div style={frameStyle}>
            <BoxTypebar item={item}/>
            <BoxIdentifier item={item}/>
            <div style={{
            overflow: 'auto',
            height: 'calc(100% - 70px)'
        }} data-marker='databox-scrollbox' ref={this.scrollelementref}>
                <div>
                    <CategoriesBar item={item} refid={this.state.refid} getListItem={this.props.getListItem} listStack={this.state.boxconfig.liststack} expandCategory={this.expandCategory} collapseCategory={this.collapseCategory} highlightItem={this.highlightItem}/>
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