// categoryitem.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import * as React from 'react'

import FontIcon from 'material-ui/FontIcon'
import QuantityBadge from '../common/quantitybadge.view'

class CategoryItem extends React.Component<any,any> {

    constructor(props) {
        super(props)
        this.barelementref = React.createRef()
    }

    barstyle = 
        {
            padding:'3px',
        }

    tabwrapperstyle:React.CSSProperties = {
        borderBottom:'1px solid #e2e6e9',
        position:'relative',
        height:'24px',
    }

    pretabstyle:React.CSSProperties = {
        display:'inline-block',
        height:'24px',
        width:'5px',
        verticalAlign:'middle',
    }

    tabstyle:React.CSSProperties = {
        display:'inline-block',
        position:'relative',
        verticalAlign:'middle',
        borderWidth:'1px',
        borderRadius:'6px 6px 0 0',
        borderColor:'#e2e6e9',
        borderBottomColor:'white',
        borderStyle:'solid',
        paddingRight:'3px',
        marginLeft:'-1px',
        marginBottom:'-1px',
        backgroundColor:'white',
        cursor:'pointer',
    }

    barelementref:React.Ref<HTMLDivElement>

    componentDidUpdate() {
        if (this.props.highlight && this.barelementref) {
            this.props.highlightItem(this.barelementref)
        }
    }

    expandCategory = () => {
        this.props.expandCategory(this.barelementref)
    }

    barcomponent = () => (
        <div 
            style = {
                this.barstyle
            }
            ref = {this.barelementref}
        >
            <div style = {this.tabwrapperstyle}>
                <div style = {this.pretabstyle}></div>
                <div 
                    style = {this.tabstyle}
                    onClick = {this.expandCategory}
                > 
                    <FontIcon 
                        color = {this.props.data.properties.sysnode?'green':'gray'} 
                        style = {{verticalAlign:'middle'}} 
                        className='material-icons'
                    >
                        folder
                    </FontIcon> 
                    {this.props.data.properties.name}
                    <QuantityBadge quantity = {this.props.data.properties.aggregates.childcount.amount} style = {
                        {
                            left:'-10px',
                            top:'-5px',
                        }
                    }/>
                </div>
            </div>
        </div>
    )

    render() {

        return this.barcomponent()

    }
}

export default CategoryItem