// quadtitlebar.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import * as React from 'react'
import FontIcon from 'material-ui/FontIcon'

const QuadTitleBar = props => {
    return (
        <div
            style = {
                {
                    position:'relative',
                    height:'25px',
                    backgroundColor:'lightgray',
                    boxSizing:'border-box',
                    width:'100%',
                    padding: '3px 0 0 27px',
                    borderRadius:'5px 5px 0 0',
                    borderBottom:'1px solid silver',
                }
            }
        >
            <FontIcon style = {{position:'absolute',top:'0',left:'0',zIndex:3}}className='material-icons'>menu</FontIcon> 
            {props.title}
        </div>
    )
}

export default QuadTitleBar