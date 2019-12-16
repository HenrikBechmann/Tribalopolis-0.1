// infinitescroller.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React, {useEffect} from 'react'

/*
use flex

use IntersectionObserver, getBoundingClientRect

use transform:translate to extend the cradle when scrolling

explore use of requestAnimationFrame. use inmotion var as a sentinal

use context api for scroll

allow list type static or dynamic. Static items can be re-ordered; dynamic items are virtual

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

    let scrollData = {}

    let onAfterScrollTimeout

    const onScroll = (e) => {

        let target = e.target || e.currentTarget
        if (onAfterScrollTimeout) {
            clearTimeout(onAfterScrollTimeout)
        }
        
        onAfterScrollTimeout = setTimeout(onAfterScroll,200)
        console.log('scroll: scrollLeft, scrollTop',target.scrollLeft,target.scrollTop)
    }

    const onAfterScroll = () => {
        if (onAfterScrollTimeout) {
            clearTimeout(onAfterScrollTimeout)
        }
        console.log('scrolling ended')
    }

    return <div style = {
        {
            position:'absolute',
            height:'100%',
            width:'100%',
            overflow:'auto',
            backgroundColor:'red',
        }}
    onScroll = {onScroll}
    >{props.children}</div>
}

const Scrollblock = (props) => {
    let {size, offset, dimensions, pattern, direction } = props
    /*
        calculate styles
    */
    return <div style={{height:'100%',width:'20000px',backgroundColor:'green'}}>{props.children}</div>
}

const Cradle = (props) => {
    let { runway, size, offset, dimensions, pattern, direction, getItem, placeholders } = props
    /*
        calculate behaviour. set start or end to foce expansion in the other direction
    */
    return <div style = {
        {
            position:'absolute',
            left:'250px',
            right:'auto',
            top:0,
            bottom:0,
            width:'250px',
            backgroundColor:'blue',
        }}>{props.children}</div>
}

/*

    dimensions has height, width, and gutter
    gutter on the left

*/

const SimpleScroller = (props) => {
    let { runway, size, offset, dimensions, pattern, direction, getItem, placeholders } = props
    console.log('inside Scroller')
    // useEffect(registerScrollEvent)

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

export default SimpleScroller
