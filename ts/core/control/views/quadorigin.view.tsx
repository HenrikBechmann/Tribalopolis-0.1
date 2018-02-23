// quadbasket.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import * as React from 'react'
import OriginMenu from './originmenu.view'

const QuadOrigin = props => {
    return (
        <div 
            style = {
                {
                    position:'absolute',
                    top:'24px',
                    left:'0',
                    width:'60px',
                    height:'60px',
                    backgroundColor:'green',
                    borderBottomRightRadius:'8px',
                    zIndex:2,
                }
            }>
            {props.children}
            <OriginMenu />
        </div>    
    )
}

export default QuadOrigin