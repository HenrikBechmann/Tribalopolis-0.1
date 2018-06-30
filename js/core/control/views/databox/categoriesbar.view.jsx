// boxheader.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import CategoriesList from './categorieslist.view';
class CategoriesBar extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            open: true,
        };
        this.toggleList = () => {
            this.setState({
                open: !this.state.open,
            });
        };
    }
    render() {
        let { node } = this.props;
        let styles = {
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
        let buttonStyle = {
            padding: '0',
            width: '24px',
            height: '24px',
            float: 'right',
            marginRight: '4px',
        };
        let actionButtonStyle = Object.assign({}, buttonStyle, { boxSizing: 'border-box' });
        let iconStyle = {
            transform: 'rotate(' + (this.state.open ? '0deg' : '180deg') + ')',
            transition: 'transform 0.5s .1s ease-out',
        };
        let checkIconStyle = {};
        return <div>
            <div style={styles}>
                <IconButton style={buttonStyle} iconStyle={iconStyle} onClick={() => { this.toggleList(); }}>
                    <FontIcon className='material-icons'>expand_less</FontIcon> 
                </IconButton>
                <IconButton style={actionButtonStyle} iconStyle={{ fontSize: '20px' }}>
                    <FontIcon color='green' className='material-icons'>edit</FontIcon> 
                </IconButton>
                <FontIcon style={{ verticalAlign: 'middle' }} className='material-icons'>list</FontIcon> 
                <span style={{ verticalAlign: 'middle' }}>Links (6558)</span>
            </div>
            <CategoriesList open={this.state.open} node={node} getCategory={this.props.getCategory}/>
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