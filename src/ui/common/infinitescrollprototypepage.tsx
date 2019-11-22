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
    pattern = fixed|variable|grid|masonry
    direction = horizontal|vertical|any
    // defaultsize
    getnewelement
    size (size of dataset)
    offset 
    generation?? (to trigger updates)
    placeholder (over-rides defaultsize)
    runwaylength
    runwayelements
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
    let {size, offset, dimensions, pattern, direction } = props
    /*
        calculate styles
    */
    return <div>{props.children}</div>
}

const Cradle = (props) => {
    let { runway, size, offset, dimensions, pattern, direction, getItem, placeholders } = props
    /*
        calculate behaviour
    */
    return <div>{props.children}</div>
}

/*

    dimensions has height, width, and gutter
    gutter on the left

*/

const Scroller = (props) => {
    let { runway, size, offset, dimensions, pattern, direction, getItem, placeholders } = props

    return <Viewport>

        <Scrollblock

            size = { size }
            offset = { offset }
            dimensions = { dimensions }
            pattern = { pattern }
            direction = { direction }

        >

            <Cradle 

                size = { size }
                offset = { offset }
                dimensions = { dimensions }
                pattern = { pattern }
                direction = { direction }

                runway = { runway } 
                placeholders = { placeholders }
                getItem = { getItem }

            />

        </Scrollblock>
        
    </Viewport>

}
