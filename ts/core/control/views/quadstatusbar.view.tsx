// quadtitlebar.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import * as React from 'react'

const QuadStatusBar = props => {
    return (
        <div
            style = {
                {
                    position: 'absolute',
                    height:'25px',
                    boxSizing:'border-box',
                    backgroundColor:'paleturquoise',
                    width:'100%',
                    bottom:'0',
                    padding:'3px',
                    borderRadius:'0 0 5px 5px',
                    borderTop:'2px solid gray',
                }
            }
        >
            {props.status}
        </div>
    )
}

export default QuadStatusBar