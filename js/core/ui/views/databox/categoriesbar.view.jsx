// boxheader.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
import FontIcon from 'material-ui/FontIcon';
import CategoriesList from './categorylist.view';
import QuantityBadge from '../common/quantitybadge.view';
import ActionButton from '../common/actionbutton.view';
class CategoriesBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: true,
            count: 6558,
        };
        // toggleList = () => {
        //     this.setState({
        //         open:!this.state.open,
        //     })
        // }
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
        this.barelementref = React.createRef();
    }
    render() {
        let { item, listStack, getListItem } = this.props;
        let { listref: listroot } = item;
        let listref;
        if (listStack.length) {
            listref = listStack[listStack.length - 1];
        }
        else {
            listref = listroot;
        }
        let list = getListItem(listref);
        let name = list.properties.name;
        let count = list.properties.aggregates.childcount.amount;
        return <div>
            <div style={this.barstyle} ref={this.barelementref}>
                <div style={this.tabwrapperstyle}>
                    <ActionButton icon='more_vert'/>
                    {false ? <ActionButton icon='info'/> : null}
                    {listStack.length ?
            <ActionButton icon='arrow_back' action={this.props.collapseCategory}/>
            : null}
                    <div style={this.pretabstyle}></div>
                    <div style={this.tabstyle}> 
                        <FontIcon style={{ verticalAlign: 'middle' }} className='material-icons'>folder_open</FontIcon> 
                        <QuantityBadge quantity={count} style={{ left: '-6px', top: '-8px' }}/>

                        <div style={{
            display: 'inline-block',
            verticalAlign: 'middle',
        }}>
                            {name}
                        </div>
                    </div>
                </div>
            </div>
            <CategoriesList open={this.state.open} list={list} getListItem={getListItem} expandCategory={this.props.expandCategory}/>
        </div>;
    }
}
export default CategoriesBar;
//# sourceMappingURL=categoriesbar.view.jsx.map