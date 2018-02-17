// quadplatform.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import * as React from 'react'

const QuadPlatform = props => {
    return (
        <div id = "quadplatform" style={
            {
                position:'relative',
                width:'200%',
                height:'200%',
            }
        } >
            { props.children }
        </div>        
    )
}

export default QuadPlatform