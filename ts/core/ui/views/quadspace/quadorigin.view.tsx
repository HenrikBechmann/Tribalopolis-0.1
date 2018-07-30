// quadbasket.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import * as React from 'react'
import OriginMenu from './quadoriginmenu.view'
import FontIcon from 'material-ui/FontIcon'
import QuantityBadge from '../common/quantitybadge.view'

const QuadOrigin = props => {
    return (
        <div 
            style = {
                {
                    position:'absolute',
                    top:'24px',
                    left:'0',
                    width:'40px',
                    height:'60px',
                    backgroundColor:'green',
                    borderRadius:'8px',
                    zIndex:2,
                }
            }
        >
            <QuantityBadge quantity = {props.stackdepth} />
            <QuantityBadge quantity = {props.stackpointer + 1} 
                style = {{
                    top:'auto',
                    bottom:'0',
                    right:'auto',
                    left: '0',
                    backgroundColor:'red',
                    color:'white',
               }}
            />
            <div style = {
                {
                    position:'absolute',
                    margin:'auto',
                    top:'10px',
                    left:'0',
                    opacity:.3,
                    width:'100%',
                    textAlign:'center',
                }
            }
            >
                <img style = {{width:'40px'}} src = '/public/icons/OriginStack.svg' />
            </div>
            <OriginMenu 
                stackdepth = {props.stackdepth}  
                stackpointer = {props.stackpointer}
                incrementStackSelector = {props.incrementStackSelector}
                decrementStackSelector = {props.decrementStackSelector}
            />
        </div>    
    )
}
                // <FontIcon style = {{fontSize:'32px'}} className='material-icons'>filter_none</FontIcon> 

export default QuadOrigin