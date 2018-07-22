// databox.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
import BoxIdentifier from './views/databox/identitybar.view';
import BoxTypebar from './views/databox/typebar.view';
import CategoriesBar from './views/databox/categoriesbar.view';
class DataBox extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            opacity: 0,
            boxconfig: this.props.boxConfig
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
            boxConfig.liststack.pop();
            this.setState({
                boxConfig,
            });
        };
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
        }}>
                <div>
                    <CategoriesBar item={item} getListItem={this.props.getListItem} listStack={this.state.boxconfig.liststack} expandCategory={this.expandCategory} collapseCategory={this.collapseCategory}/>
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