// infinitescroller.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

/*
use flex

use IntersectionObserver, getBoundingClientRect

use transform:translate to extend the cradle when scrolling

explore use of requestAnimationFrame

viewport
scrollblock
cradle (for items)

allow a position bar at bottom -- scrolling stops (and cradle fades) while 
position bar value is being changed. Position bar gives feedback on location (configureable)

change key for updates

transform out of view items to blank space

allow for dividers

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
    inverted (invert scroll direction)
    headercomponent
    footercomponent

TODO: get scrolldirection
*/

const Viewport = (props) => {
    return <div style = {
        {
            position:'absolute',
            height:'100%',
            width:'100%',
            overflow:'auto',
            backgroundColor:'red',
        }
    }>{props.children}</div>
}

const Scrollblock = (props) => {
    let {size, offset, dimensions, pattern, direction } = props
    /*
        calculate styles
    */
    return <div style={{height:'100%',width:'2000px',backgroundColor:'green'}}>{props.children}</div>
}

const Cradle = (props) => {
    let { runway, size, offset, dimensions, pattern, direction, getItem, placeholders } = props
    /*
        calculate behaviour
    */
    return <div style = {
        {
            height:'100%', 
            width:'300px',
            backgroundColor:'blue',
            transform:'translate(250px)'
        }}>{props.children}</div>
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

export default Scroller
