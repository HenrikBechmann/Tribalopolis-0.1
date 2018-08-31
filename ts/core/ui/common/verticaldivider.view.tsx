// verticaldivider.view.tsx

// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import * as React from 'react'

const VerticalDivider = (props) => (
    <div style = {
        {
            display:'inline-block',
            height:'1.5em',
            borderLeft:'1px solid gray',
            verticalAlign:'middle',
        }
    }></div>
)

export default VerticalDivider