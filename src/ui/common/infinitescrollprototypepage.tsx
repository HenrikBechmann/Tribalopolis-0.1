// infinitescroller.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

/*
use flex

viewport
scrollblock
cradle (for items)

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
    return <div style = {
        {
            position:'absolute',
            height:'100%',
            width:'100%',
            overflow:'auto'
        }
    }>{props.children}</div>
}

const Scrollblock = (props) => {
    let {length, offset, dimensions, type } = props
    /*
        calculate styles
    */
    return <div>{props.children}</div>
}

const Cradle = (props) => {
    let { runway, length, offset, dimensions, type, getItem, childlist, placeholders } = props
    /*
        calculate behaviour
    */
    return <div>{props.children}</div>
}

/*

    dimensions has length, width, and gutter
    gutter on the left

*/

const Scroller = (props) => {
    let { childlist, runway, length, offset, dimensions, type, getItem, placeholders } = props

    return <Viewport>

        <Scrollblock

            length = { length }
            offset = { offset }
            dimensions = { dimensions }
            type = { type }

        >

            <Cradle 

                runway = { runway } 

                length = { length }
                offset = { offset }
                dimensions = { dimensions }
                type = { type }

                getItem = { getItem }
                childlist = { childlist }

                placeholders = { placeholders }

            />

        </Scrollblock>
        
    </Viewport>

}
