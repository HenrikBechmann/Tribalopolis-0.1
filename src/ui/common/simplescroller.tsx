// infinitescroller.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React, {useContext, useState, useRef, useEffect, useMemo} from 'react'

import { GenericObject } from '../../services/interfaces'

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

TODO: reset if direction is suddenly reversed
*/

const SCROLL_DIFF_FOR_UPDATE = 20
const SCROLL_TIMEOUT_FOR_ONAFTERSCROLL = 250
const ScrollContext = React.createContext(null)

const Viewport = (props) => {
    let [scrollData, updateScrollData] = useState(null)
    let scrolldiv:any = useRef()
    let scrollTimeout = useRef(undefined)

    console.log('starting ViewPort')

    useEffect(() => {
        let scrollData:GenericObject = {}
        scrollData.startingScrollLeft = scrolldiv.current.scrollLeft
        scrollData.startingScrollTop = scrolldiv.current.scrollTop
        updateScrollData(scrollData)
        // console.log('running useEffect:scrolldiv, scrollData',scrolldiv, scrollData)
    },[])


    const onScroll = (e) => {

        let target = e.target || e.currentTarget
        if (scrollTimeout.current) {
            clearTimeout(scrollTimeout.current)
        }
        scrollTimeout.current = setTimeout(onAfterScroll,SCROLL_TIMEOUT_FOR_ONAFTERSCROLL)

        scrollData.scrolling = true

        if (scrollData.scrollingForward === undefined) {
            if (target.scrollLeft !== scrollData.startingScrollLeft) {
                scrollData.scrollingForward = (target.scrollLeft > scrollData.startingScrollLeft)
                // initialize
                scrollData.scrollLeft = scrollData.startingScrollLeft
                scrollData.scrollTop = scrollData.startingScrollTop
                scrollData.previousScrollLeft = scrollData.scrollLeft
                scrollData.previousScrollTop = scrollData.scrollTop
                console.log('initialized scrolldata',scrollData)
                scrollData = Object.assign({},scrollData)
                updateScrollData(scrollData)
            }
        }
        let absdiff = Math.abs(scrollData.scrollLeft - target.scrollLeft) 
        if ( absdiff <=SCROLL_DIFF_FOR_UPDATE) {
            // console.log('returning with absdiff',absdiff)
            return
        }

        // console.log('continuing with absdiff',absdiff)

        scrollData.scrollingForward = (target.scrollLeft > scrollData.scrollLeft)
        scrollData.previousScrollLeft = scrollData.scrollLeft
        scrollData.previousScrollTop = scrollData.scrollTop
        scrollData.scrollLeft = target.scrollLeft
        scrollData.scrollTop = target.scrollTop

        scrollData = Object.assign({},scrollData)
        updateScrollData(scrollData)

        // console.log('scroll: scrollLeft, scrollTop, scrollData',target.scrollLeft,target.scrollTop, scrollData)
    }

    const onAfterScroll = () => {
        if (scrollTimeout.current) {
            clearTimeout(scrollTimeout.current)
            scrollTimeout.current = undefined 
        }
        scrollData.scrolling = false
        scrollData.scrollingForward = undefined
        scrollData.startingScrollLeft = scrollData.scrollLeft
        scrollData.startingScrollTop = scrollData.scrollTop
        // latestScrollData = scrollData
        // scrollData = {}
        scrollData = Object.assign({},scrollData)
        updateScrollData(scrollData)
        console.log('scrolling ended:scrollData',scrollData)
    }

    return <ScrollContext.Provider value = {scrollData}><div 
        style = {
            {
                position:'absolute',
                height:'100%',
                width:'100%',
                overflow:'auto',
                backgroundColor:'red',
            }}
        onScroll = {onScroll}
        ref = {scrolldiv}
    >{props.children}</div></ScrollContext.Provider>
}

const Scrollblock = (props) => {
    let {size, offset, dimensions, pattern, direction } = props
    let scrollData = useContext(ScrollContext)
    console.log('Scrollblock scrollData',scrollData)
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
