// viewport.tsx
// copyright (c) 2020 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

/*
    The role of viewport is to provide data to its children (cradle)
*/

'use strict'

import React, {useState, useRef, useEffect} from 'react'

import { GenericObject } from '../../../services/interfaces'

export const ScrollContext = React.createContext(null)

// control constants
const SCROLL_DIFF_FOR_UPDATE = 20
const SCROLL_TIMEOUT_FOR_ONAFTERSCROLL = 250
const RESIZE_TIMEOUT_FOR_ONAFTERSRESIZE = 250

const Viewport = ({children}) => { // props

    let [scrollData, updateScrollData] = useState(null)
    let scrolldiv = useRef(undefined)
    let scrollTimeout = useRef(undefined)
    let resizeTimeout = useRef(undefined)
    let divlinerstyleref = useRef({
        position:'absolute',
        height:'100%',
        width:'100%',
        overflow:'auto',
        backgroundColor:'red',
    })

    useEffect(() => { // initialize scrollData
        let localScrollData:GenericObject = {}
        scrollData = localScrollData
        scrollData.startingScrollLeft = scrolldiv.current.scrollLeft
        scrollData.startingScrollTop = scrolldiv.current.scrollTop
        scrollData.viewportRect = scrolldiv.current.getBoundingClientRect()

        window.addEventListener('resize', onResize)

        updateScrollData(scrollData)

        return () => {
            window.removeEventListener('resize', onResize)
        }

    },[])

    let divlinerstyle = divlinerstyleref.current as React.CSSProperties
    // console.log('starting ViewPort', scrollData)

    const onDoResize = () => {
        // console.log('onResize', scrollData)
        scrollData = Object.assign({},scrollData)
        scrollData.viewportRect = scrolldiv.current.getBoundingClientRect()
        updateScrollData(scrollData)
    }

    const onResize = (e) => {
        if (resizeTimeout.current) {
            clearTimeout(resizeTimeout.current)
        }
        resizeTimeout.current = setTimeout(
            onDoResize,
            RESIZE_TIMEOUT_FOR_ONAFTERSRESIZE
        )
    }

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
                // console.log('initialized scrolldata',scrollData)
                scrollData = Object.assign({},scrollData)
                updateScrollData(scrollData)
            }
        }
        let absdiff = Math.abs(scrollData.scrollLeft - target.scrollLeft) 
        if ( absdiff <= SCROLL_DIFF_FOR_UPDATE) {
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
        // console.log('scrolling ended:scrollData',scrollData)
    }

    return <ScrollContext.Provider value = { scrollData }>
        <div 
            style = {divlinerstyle}
            onScroll = {onScroll}
            ref = {scrolldiv}
        >
            { children }
        </div>
    </ScrollContext.Provider>
    
} // Viewport

export default Viewport