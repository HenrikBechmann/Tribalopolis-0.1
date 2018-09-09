// directoryitem.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import React from 'react'

import Icon from '@material-ui/core/Icon'
import QuantityBadge from '../common/quantitybadge.view'

class DirectoryItem extends React.Component<any,any> {

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

    barelementref

    componentDidUpdate() {
        if (this.props.highlight && this.barelementref) {
            this.props.highlightItem(this.barelementref)
        }
    }

    expandDirectoryItem = () => {
        this.props.expandDirectoryItem(this.barelementref.current)
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
                    onClick = {this.expandDirectoryItem}
                > 
                    <Icon 
                        style = {
                            {
                                verticalAlign:'middle',
                                color:this.props.data.properties.sysnode?'green':'gray',
                            }
                        } 
                    >
                        folder
                    </Icon> 
                    {this.props.data.properties.name}
                    <QuantityBadge quantity = {this.props.data.properties.numbers.list.count} style = {
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

export default DirectoryItem