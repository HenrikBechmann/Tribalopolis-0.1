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
        this.styles = {
            width: '100%',
            border: '1px solid transparent',
            borderRadius: '8px',
            padding: '3px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            boxSizing: 'border-box',
            marginBottom: '1px',
            fontSize: 'larger',
            position: 'sticky',
            top: '0',
            backgroundColor: '#f2f2f2',
            zIndex: 1,
        };
        this.iconStyle = () => ({
            transform: 'rotate(' + (this.state.open ? '0deg' : '180deg') + ')',
            transition: 'transform 0.5s .1s ease-out',
        });
    }
    render() {
        let { node } = this.props;
        return <div>
            <div style={this.styles}>
                <ActionButton icon='expand_less' iconStyle={this.iconStyle()} action={this.toggleList}/>
                <ActionButton icon='edit' iconStyle={{ fontSize: '20px', color: 'green' }}/>

                <FontIcon style={{ verticalAlign: 'middle' }} className='material-icons'>list</FontIcon> 
                <QuantityBadge quantity={this.state.count} style={{ left: '-2px', top: '-4px' }}/>

                <div style={{
            display: 'inline-block',
            verticalAlign: 'middle',
        }}>
                    Links
                </div>
            </div>
            <CategoriesList open={this.state.open} node={node} getListItem={this.props.getListItem}/>
        </div>;
    }
}
// <div style = {{fontSize:'smaller'}}>
//     <span>for all roles</span>
//     <IconButton style = {{...buttonStyle,float:'none', verticalAlign:'middle'}} >
//         <FontIcon color = 'green' className = 'material-icons'>arrow_drop_down</FontIcon>
//     </IconButton>
// </div>
export default CategoriesBar;
//# sourceMappingURL=categoriesbar.view.jsx.map