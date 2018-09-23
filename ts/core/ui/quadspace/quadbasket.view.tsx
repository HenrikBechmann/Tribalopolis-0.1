// quadbasket.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import React from 'react'

const QuadBasket = props => {
    return (
        <div id="quadbasket" 
            style = {
                {
                    position:'absolute',
                    top:0,
                    right:0,
                    width:'96px',
                    height:'48px',
                    backgroundColor:'brown',
                    zIndex:1,
                    borderRadius: '8px',
                    display:'flex',
                    justifyContent:'center',
                    alignItems:'center',
                }
            }>
            <div style = {{fontWeight:'bold',color:'gray',opacity:0.7}}>
                TRANSFER
            </div>
            <div style = {{position:'absolute',top:0, right:0,bottom:0,left:0}}>
                {props.children}
            </div>
        </div>    
    )
}

export default QuadBasket