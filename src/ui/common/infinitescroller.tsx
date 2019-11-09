// infinitescroller.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

/*
use flex
viewport
scrollblock
cradle (for data)
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