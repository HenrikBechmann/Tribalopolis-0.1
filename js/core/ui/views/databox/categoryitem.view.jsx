// categoryitem.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
import FontIcon from 'material-ui/FontIcon';
import QuantityBadge from '../common/quantitybadge.view';
class CategoryItem extends React.Component {
    constructor(props) {
        super(props);
        this.barstyle = {
            padding: '3px',
        };
        this.tabwrapperstyle = {
            borderBottom: '1px solid #e2e6e9',
            position: 'relative',
            height: '24px',
        };
        this.pretabstyle = {
            display: 'inline-block',
            height: '24px',
            width: '5px',
            verticalAlign: 'middle',
        };
        this.tabstyle = {
            display: 'inline-block',
            position: 'relative',
            verticalAlign: 'middle',
            borderWidth: '1px',
            borderRadius: '6px 6px 0 0',
            borderColor: '#e2e6e9',
            borderBottomColor: 'white',
            borderStyle: 'solid',
            paddingRight: '3px',
            marginLeft: '-1px',
            marginBottom: '-1px',
            backgroundColor: 'white',
            cursor: 'pointer',
        };
        this.expandCategory = () => {
            this.props.expandCategory();
        };
        this.barcomponent = () => (<div style={this.barstyle} ref={this.barelementref}>
            <div style={this.tabwrapperstyle}>
                <div style={this.pretabstyle}></div>
                <div style={this.tabstyle} onClick={this.expandCategory}> 
                    <FontIcon color={this.props.data.properties.sysnode ? 'green' : 'gray'} style={{ verticalAlign: 'middle' }} className='material-icons'>
                        folder
                    </FontIcon> 
                    {this.props.data.properties.name}
                    <QuantityBadge quantity={this.props.data.properties.aggregates.childcount.amount} style={{
            left: '-10px',
            top: '-5px',
        }}/>
                </div>
            </div>
        </div>);
        this.barelementref = React.createRef();
    }
    componentDidUpdate() {
        if (this.props.highlight && this.barelementref) {
            this.props.highlightItem(this.barelementref);
        }
    }
    render() {
        return this.barcomponent();
    }
}
export default CategoryItem;
//# sourceMappingURL=categoryitem.view.jsx.map