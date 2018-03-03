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
            border: '1px solid silver',
            borderRadius: '8px',
            padding: '3px',
            whitespace: 'nowrap',
            overflow: 'hidden',
            boxSizing: 'border-box',
            marginBottom: '3px',
            fontSize: 'larger',
        };
        let buttonStyle = {
            padding: '0',
            width: '24px',
            height: '24px',
            float: 'right',
            marginRight: '4px',
        };
        let iconStyle = {
            transform: 'rotate(' + (this.state.open ? '0deg' : '180deg') + ')',
            transition: 'transform 0.5s ease-out',
        };
        return <div>
            <div style={styles}>
                <IconButton style={buttonStyle} iconStyle={iconStyle} onClick={() => { this.toggleList(); }}>
                    <FontIcon className='material-icons'>expand_less</FontIcon> 
                </IconButton>
                <FontIcon style={{ verticalAlign: 'middle' }} className='material-icons'>list</FontIcon> 
                <span style={{ verticalAlign: 'middle' }}>Activity Categories {`(${node.categories.order.length})`}</span>
            </div>
            <CategoriesList open={this.state.open} node={node}/>
        </div>;
    }
}
export default CategoriesBar;
//# sourceMappingURL=categoriesbar.view.jsx.map