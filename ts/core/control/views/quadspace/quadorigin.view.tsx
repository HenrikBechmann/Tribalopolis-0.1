// quadbasket.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import * as React from 'react'
import OriginMenu from './quadoriginmenu.view'
import FontIcon from 'material-ui/FontIcon'

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
            <div style = {
                {
                    position:'absolute',
                    margin:'auto',
                    top:'14px',
                    left:'0',
                    opacity:.3,
                    width:'100%',
                    textAlign:'center',
                }
            }
            >
                <FontIcon style = {{fontSize:'32px'}} className='material-icons'>filter_none</FontIcon> 
            </div>
            {props.children}
            <OriginMenu />
        </div>    
    )
}

export default QuadOrigin