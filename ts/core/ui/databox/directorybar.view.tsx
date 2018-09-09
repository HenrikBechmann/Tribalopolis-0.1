// directorybar.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import React from 'react'

import Icon from '@material-ui/core/Icon'

import QuantityBadge from '../common/quantitybadge.view'
import ActionButton from '../common/actionbutton.view'

class DirectoryBar extends React.Component<any,any> {

    barstyle:React.CSSProperties = {
        width:'100%',
        borderRadius:'8px 8px 0 0',
        paddingTop:'3px',
        whiteSpace:'nowrap',
        overflow:'hidden',
        boxSizing:'border-box',
        marginBottom: '1px',
        top:'0',
        backgroundColor:'#f2f2f2',
        zIndex:1,
    }

    tabwrapperstyle:React.CSSProperties = {
        borderBottom:'1px solid silver',
        position:'relative',
        height:'32px',
    }

    pretabstyle:React.CSSProperties = {
        display:'inline-block',
        height:'32px',
        width:'5px',
        verticalAlign:'middle',
    }

    tabstyle:React.CSSProperties = {
        display:'inline-block',
        position:'relative',
        verticalAlign:'middle',
        borderWidth:'1px',
        borderRadius:'6px 6px 0 0',
        borderColor:'silver silver white silver',
        borderStyle:'solid',
        paddingRight:'3px',
        marginLeft:'-1px',
        marginBottom:'-7px',
        backgroundColor:'white',
        // cursor:'pointer',
    }

    render() {

        let { item,listStack, getList } = this.props

        let { list:listroot } = item

        let listref

        if (listStack.length) {
            listref = listStack[listStack.length-1]
        } else {
            listref = listroot
        }

        let list = getList(listref)

        let name = list.properties.name
        let count = list.properties.numbers.list.count

        return <div>
            <div 
                style = {this.barstyle}
            >
                <div style = {this.tabwrapperstyle}>
                    {false?<ActionButton 
                        icon = 'more_vert'
                    />:null}
                    <ActionButton 
                        img = '/public/icons/org_chart.svg'
                    />
                    {false?<ActionButton icon = 'info'/>:null}
                    {listStack.length?
                        <div style = {{float:'right',width:'32px',height:'32px', position:'relative'}}>
                            <QuantityBadge 
                                quantity = {listStack.length} 
                                style = {{left:'-6px',top:'-6px'}}
                            />
                            <ActionButton 
                                icon = 'arrow_back'
                                action = {this.props.collapseDirectoryItem}
                            />
                        </div>
                        :null}
                    <div style = {this.pretabstyle}></div>
                    <div 
                        style = {this.tabstyle}
                    > 
                        <Icon style = {{verticalAlign:'middle'}}>folder_open</Icon> 
                        <QuantityBadge quantity = {count} style = {{left:'-6px',top:'-8px'}}/>

                        <div style = {
                            {
                                display:'inline-block',
                                verticalAlign:'middle',                        
                            }
                        } >
                            {name}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default DirectoryBar