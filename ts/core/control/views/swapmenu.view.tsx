// swapmenu.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import * as React from 'react'

import FontIcon from 'material-ui/FontIcon'
import IconButton from 'material-ui/IconButton'

const SwapMenu = ({ quadrant }) => {

    let tilt = null
    if (quadrant == 'topleft' || quadrant == 'bottomright') {
        tilt = '-45deg'
    } else {
        tilt = '45deg'
    }

    return <div 
        style = {
            {
                position:'absolute',
                height:'26px',
                right:'0',
                top:'0',
                border:'1px solid silver',
                borderRadius:'0 8px 0 8px',
                backgroundColor:'lightgray',
                zIndex:1,
                padding:'3px',
            }
        } 
    >
        <FontIcon color = 'green' style = {{marginRight:'8px',border:'1px solid silver',borderRadius:'50%',}} className='material-icons'>swap_vert</FontIcon>
        <FontIcon color = 'green' style = {{margin:'0 8px',border:'1px solid silver',borderRadius:'50%',transform:`rotate(${tilt})`}} className='material-icons'>swap_vert</FontIcon>
        <FontIcon color = 'green' style = {{marginLeft:'8px',border:'1px solid silver',borderRadius:'50%',}} className='material-icons'>swap_horiz</FontIcon>
    </div>
}

export default SwapMenu