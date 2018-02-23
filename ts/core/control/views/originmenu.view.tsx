// swapmenu.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import * as React from 'react'

import FontIcon from 'material-ui/FontIcon'
import IconButton from 'material-ui/IconButton'

const OriginMenu = (props) => {

    return <div 
        style = {
            {
                position:'absolute',
                height:'96px',
                bottom:'-104px',
                border:'1px solid silver',
                borderRadius:'0 0 8px 0',
                backgroundColor:'lightgray',
                zIndex:1,
                padding:'3px',
                opacity:0.7,
                width:'26px',
            }
        } 
    >
        <FontIcon color = 'green' style = {{marginBottom:'4px',border:'1px solid silver',borderRadius:'50%',}} className='material-icons'>home</FontIcon>
        <FontIcon color = 'green' style = {{margin:'4px 0',border:'1px solid silver',borderRadius:'50%',}} className='material-icons'>arrow_back</FontIcon>
        <FontIcon color = 'green' style = {{marginTop:'4px',border:'1px solid silver',borderRadius:'50%',}} className='material-icons'>arrow_forward</FontIcon>
    </div>
}

export default OriginMenu