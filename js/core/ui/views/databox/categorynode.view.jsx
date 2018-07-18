// categoryitem.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
import FontIcon from 'material-ui/FontIcon';
import QuantityBadge from '../common/quantitybadge.view';
class CategoryNode extends React.Component {
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
        this.barcomponent = () => (<div style={this.barstyle} ref={this.barelementref}>
            <div style={this.tabwrapperstyle}>
                <div style={this.pretabstyle}></div>
                <div style={this.tabstyle}> 
                    <FontIcon color={this.props.data.sysnode ? 'green' : 'gray'} style={{ verticalAlign: 'middle' }} className='material-icons'>
                        folder
                    </FontIcon> 
                    {this.props.data.name}
                    <QuantityBadge quantity={this.props.data.aggregates.childcount.amount} style={{
            left: '-10px',
            top: '-5px',
        }}/>
                </div>
            </div>
        </div>);
        this.barelementref = React.createRef();
    }
    // barelement = () => (this.barcomponent) 
    render() {
        console.log('barelementref', this.barelementref);
        // // let newelement
        // // let barelement = this.barcomponent()
        // let newelement = React.cloneElement(this.barcomponent())
        // console.log('newelement',newelement)
        // let { id,data } = this.props
        // let {name, sysnode} = data
        // let count = data.aggregates.childcount.amount
        return this.barcomponent();
    }
}
export default CategoryNode;
//# sourceMappingURL=categorynode.view.jsx.map