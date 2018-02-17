// quadtitlebar.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import * as React from 'react'

const QuadTitleBar = props => {
    return (
        <div
            style = {
                {
                    height:'24px',
                    backgroundColor:'cyan',
                    boxSizing:'border-box',
                    width:'100%',
                    padding: '3px',
                    borderRadius:'8px 8px 0 0',
                }
            }
        >
            {props.title}
        </div>
    )
}

export default QuadTitleBar