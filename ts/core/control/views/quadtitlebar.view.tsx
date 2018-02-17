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
                    width:'100%'
                }
            }
        >
            {props.title}
        </div>
    )
}

export default QuadTitleBar