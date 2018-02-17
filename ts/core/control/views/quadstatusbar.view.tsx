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
                    height:'24px',
                    backgroundColor:'cyan',
                    width:'100%',
                    bottom:'0',
                    padding:'3px',
                }
            }
        >
            {props.status}
        </div>
    )
}

export default QuadStatusBar