// boxheader.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import * as React from 'react'

import IconButton from 'material-ui/IconButton'
import FontIcon from 'material-ui/FontIcon'

import CategoriesList from './categorieslist.view'
import QuantityBadge from '../common/quantitybadge.view'

class CategoriesBar extends React.Component<any,any> {

    state = {
        open:true,
        count:6558,
    }

    toggleList = () => {
        this.setState({
            open:!this.state.open,
        })
    }

    styles:React.CSSProperties = {
        width:'100%',
        border:'1px solid transparent',
        borderRadius:'8px',
        padding:'3px',
        whiteSpace:'nowrap',
        overflow:'hidden',
        boxSizing:'border-box',
        marginBottom: '1px',
        fontSize:'larger',
        position:'sticky',
        top:'0',
        backgroundColor:'#f2f2f2',
        zIndex:1,
    }

    buttonStyle:React.CSSProperties = {
        padding:'0',
        width:'24px',
        height:'24px',
        float:'right',
        marginRight:'4px',
    }

    actionButtonStyle:React.CSSProperties = {
        ...this.buttonStyle,
        boxSizing:'border-box',
    }

    iconStyle:React.CSSProperties = {
        transform:'rotate(' + (this.state.open?'0deg':'180deg') + ')',
        transition:'transform 0.5s .1s ease-out',
    }

    checkIconStyle:React.CSSProperties = {

    }

    render() {

        let { node } = this.props

        return <div>
            <div style = {this.styles}>
                <IconButton style = {this.buttonStyle}
                    iconStyle = {this.iconStyle}
                    onClick = {
                        () => {this.toggleList()}
                    }
                >
                    <FontIcon className='material-icons'>expand_less</FontIcon> 
                </IconButton>
                <IconButton style = {this.actionButtonStyle}
                    iconStyle = {{fontSize:'20px'}}
                >
                    <FontIcon color = 'green' className='material-icons'>edit</FontIcon> 
                </IconButton>
                <FontIcon style = {{verticalAlign:'middle'}} className='material-icons'>list</FontIcon> 
                <div style = {
                    {
                        display:'inline-block',
                        verticalAlign:'middle',
                    }
                } >
                    Links
                </div>
                <div style = {
                    {
                        display:'inline-block',
                        position:'relative',
                        verticalAlign:'middle',
                        height:'24px',
                        width:'10px',
                    }
                } >
                    <QuantityBadge quantity = {this.state.count} style = {{left:0}}/>
                </div>
            </div>
            <CategoriesList open = {this.state.open} node = { node } getCategory = {this.props.getCategory} />
        </div>
    }
}

// <div style = {{fontSize:'smaller'}}>
//     <span>for all roles</span>
//     <IconButton style = {{...buttonStyle,float:'none', verticalAlign:'middle'}} >
//         <FontIcon color = 'green' className = 'material-icons'>arrow_drop_down</FontIcon>
//     </IconButton>
// </div>

export default CategoriesBar