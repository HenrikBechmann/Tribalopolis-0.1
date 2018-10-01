// quantitybadge.view.tsx

// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'

const styles = createStyles({
    root:{
        display:'block',
        position:'absolute',
        top:'-2px',
        left:'0',
        backgroundColor:'palegoldenrod',
        height:'16px',
        borderRadius:'8px',
        minWidth:'16px',
        textAlign:'center',
        color:'black',
        fontSize:'x-small',
        padding:'3px',
        boxSizing:'border-box',
        opacity:.7,
    }
})

interface propsInterface {
    style?:React.CSSProperties,
    quantity:number,
    classes:any,
}

const QuantityBadge = (props:propsInterface) => {

    let { classes, quantity } = props

    return <div className = {classes.root} style = {props.style}>{quantity}</div>

}

export default withStyles(styles)(QuantityBadge)
