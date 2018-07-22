// boxheader.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
import FontIcon from 'material-ui/FontIcon';
import CategoriesList from './categorylist.view';
import QuantityBadge from '../common/quantitybadge.view';
import ActionButton from '../common/actionbutton.view';
class CategoriesBar extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            open: true,
            count: 6558,
        };
        this.toggleList = () => {
            this.setState({
                open: !this.state.open,
            });
        };
        this.barstyle = {
            width: '100%',
            borderRadius: '8px 8px 0 0',
            paddingTop: '3px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            boxSizing: 'border-box',
            marginBottom: '1px',
            // fontSize:'larger',
            position: 'sticky',
            top: '0',
            backgroundColor: '#f2f2f2',
            zIndex: 1,
        };
        this.tabwrapperstyle = {
            borderBottom: '1px solid silver',
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
            borderColor: 'silver silver white silver',
            borderStyle: 'solid',
            paddingRight: '3px',
            marginLeft: '-1px',
            marginBottom: '-1px',
            backgroundColor: 'white',
            cursor: 'pointer',
        };
        this.iconStyle = () => ({
            transform: 'rotate(' + (this.state.open ? '0deg' : '180deg') + ')',
            transition: 'transform 0.5s .1s ease-out',
        });
    }
    render() {
        let { item } = this.props;
        let { listref } = item;
        let { getListItem } = this.props;
        let list = getListItem(listref);
        let name = list.properties.name;
        return <div>
            <div style={this.barstyle} ref={this.barelementref}>
                <div style={this.tabwrapperstyle}>
                    <ActionButton icon='more_vert'/>
                    {false ? <ActionButton icon='info'/> : null}
                    {false ? <ActionButton icon='arrow_back'/> : null}
                    <div style={this.pretabstyle}></div>
                    <div style={this.tabstyle}> 
                        <FontIcon style={{ verticalAlign: 'middle' }} className='material-icons'>folder_open</FontIcon> 
                        <QuantityBadge quantity={this.state.count} style={{ left: '-6px', top: '-8px' }}/>

                        <div style={{
            display: 'inline-block',
            verticalAlign: 'middle',
        }}>
                            {name}
                        </div>
                    </div>
                </div>
            </div>
            <CategoriesList open={this.state.open} list={list} getListItem={getListItem}/>
        </div>;
    }
}
// <ActionButton 
//     icon = 'expand_less' 
//     iconStyle = {this.iconStyle()}
//     action = {this.toggleList}
// />
// <ActionButton 
//     icon = 'edit' 
//     iconStyle = {{fontSize:'20px',color:'green'}}
// />
// <div style = {{fontSize:'smaller'}}>
//     <span>for all roles</span>
//     <IconButton style = {{...buttonStyle,float:'none', verticalAlign:'middle'}} >
//         <FontIcon color = 'green' className = 'material-icons'>arrow_drop_down</FontIcon>
//     </IconButton>
// </div>
export default CategoriesBar;
//# sourceMappingURL=categoriesbar.view.jsx.map