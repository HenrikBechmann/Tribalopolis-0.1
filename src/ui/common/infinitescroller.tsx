// infinitescroller.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

/*
use flex
viewport
scrollblock
cradle (for data)

allow a position bar at bottom -- scrolling stops (and cradle fades) while 
position bar value is being changed. Position bar gives feedback on location (configureable)

change key for updates

rubber finish at either end for visual clue

attributes
    direction = horizontal|vertical
    type = identical|variable|grid|masonry
    // defaultsize
    getnewelement
    length (length of dataset)
    generation (to trigger updates)
    placeholder (over-rides defaultsize)
    runwaylength
    runwayelements
    guttersize
*/

const Viewport = (props) => {
    return <div>{props.children}</div>
}

const Scrollblock = (props) => {
    return <div>{props.children}</div>
}

const Cradle = (props) => {
    return <div>{props.children}</div>
}


const Scroller = (props) => {
    let {children, listlength, } = props

    return <Viewport>
        <Scrollblock>
            <Cradle>
                {children}
            </Cradle>
        </Scrollblock>
    </Viewport>

}

export default Scroller