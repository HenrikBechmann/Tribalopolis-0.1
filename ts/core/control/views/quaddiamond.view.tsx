// quadbasket.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import * as React from 'react'

const QuadDiamond = props => {
    return (
        <div id="quaddiamond" 
            style = {
                {
                    position:'absolute',
                    top:'calc(50% - 48px)',
                    left:'calc(50% - 48px)',
                    width:'96px',
                    height:'96px',
                    backgroundColor:'green',
                    borderRadius:'8px',
                    transform: 'rotate(45deg)',
                    opacity:0.5,
                }
            }>
            
        </div>    
    )
}

export default QuadDiamond