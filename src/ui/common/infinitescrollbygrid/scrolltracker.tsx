// scrolltracker.tsx
// copyright (c) 2020 Henrik Bechmann, Toronto, Licence: MIT

import React from 'react'

const ScrollTracker = (props) => {
    let { top, left, offset, listsize } = props

    let trackdata = `${offset + 1}/${listsize}`

    let styles:React.CSSProperties = {
        top: top + 'px',
        left: left + 'px',
        position:'fixed',
        zIndex:3,
        backgroundColor:'white',
        border: '1px solid gray',
        borderRadius:'10px',
        fontSize:'smaller',
        padding:'3px'
    }
    return <div data-name = 'scrolltracker' style = {styles} >{trackdata}</div>
}

export default ScrollTracker