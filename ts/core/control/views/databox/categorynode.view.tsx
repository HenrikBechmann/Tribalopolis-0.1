// categoryitem.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import * as React from 'react'

import FontIcon from 'material-ui/FontIcon'
import QuantityBadge from '../common/quantitybadge.view'

const CategoryNode = props => {
    let { id,data } = props
    let {name, sysnode} = data
    let count = data.aggregates.childcount.amount

    let barstyle = 
        {
            padding:'3px',
        }

    let tabwrapperstyle:React.CSSProperties = {
        borderBottom:'1px solid #e2e6e9',
        position:'relative',
        height:'24px',
    }

    let pretabstyle:React.CSSProperties = {
        display:'inline-block',
        height:'24px',
        width:'5px',
        verticalAlign:'middle',
    }

    let tabstyle:React.CSSProperties = {
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
    }

    return <div style = {
        barstyle
    }>
        <div style = {tabwrapperstyle}>
            <div style = {pretabstyle}></div>
            <div style = {tabstyle}> 
                <FontIcon 
                    color = {sysnode?'green':'gray'} 
                    style = {{verticalAlign:'middle'}} 
                    className='material-icons'
                >
                    folder
                </FontIcon> 
                {name}
                <FontIcon 
                    color = {'gray'} 
                    style = {{verticalAlign:'middle'}} 
                    className='material-icons'
                >
                    arrow_forward
                </FontIcon> 
                <QuantityBadge quantity = {count} style = {
                    {
                        left:'-10px',
                        top:'-5px',
                    }
                }/>
            </div>
        </div>
    </div>
}

export default CategoryNode