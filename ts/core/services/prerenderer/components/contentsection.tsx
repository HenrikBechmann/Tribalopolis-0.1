// contentsection.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

const ContentSection = props => {

    return <div style = {
        {
            border:'2px solid silver',
            padding:'3px',
            marginBottom:'8px',
        }
    }>
        {props.children}
    </div>
}

export default ContentSection