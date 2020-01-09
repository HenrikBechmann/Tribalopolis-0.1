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

const Viewport = ({children, orientation}) => { // props

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

    useEffect(() => {
        window.addEventListener('resize', onResize)
        return () => {
            window.removeEventListener('resize', onResize)
        }
    },[])

    useEffect(() => { // initialize scrollData
        let localScrollData:GenericObject = {}
        scrollData = localScrollData
        scrollData.startingScrollLeft = scrolldiv.current.scrollLeft
        scrollData.startingScrollTop = scrolldiv.current.scrollTop
        scrollData.viewportRect = scrolldiv.current.getBoundingClientRect()

        // console.log('initialize scrolldata in UseEffect',scrollData, scrolldiv)

        updateScrollData(scrollData)


    },[orientation, scrolldiv])

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
            if (orientation == 'horizontal') {
                scrollData.scrollingForward = (target.scrollLeft > scrollData.startingScrollLeft)
            } else {
                scrollData.scrollingForward = (target.scrollTop > scrollData.startingScrollTop)
            }
            // initialize
            scrollData.scrollLeft = scrollData.startingScrollLeft
            scrollData.scrollTop = scrollData.startingScrollTop
            scrollData.previousScrollLeft = scrollData.scrollLeft
            scrollData.previousScrollTop = scrollData.scrollTop
            console.log('initialized scrolldata session',scrollData)
            scrollData = Object.assign({},scrollData)
            updateScrollData(scrollData)
        }
        let absdiff
        if (orientation == 'horizontal') {
            absdiff = Math.abs(scrollData.scrollLeft - target.scrollLeft) 
        } else {
            absdiff = Math.abs(scrollData.scrollTop - target.scrollTop) 
        }
        // console.log('absdiff',absdiff)
        if ( absdiff <= SCROLL_DIFF_FOR_UPDATE) {

            return

        }

        if (orientation == 'horizontal') {
            scrollData.scrollingForward = (target.scrollLeft > scrollData.startingScrollLeft)
        } else {
            scrollData.scrollingForward = (target.scrollTop > scrollData.startingScrollTop)
        }
        scrollData.previousScrollLeft = scrollData.scrollLeft
        scrollData.previousScrollTop = scrollData.scrollTop
        scrollData.scrollLeft = target.scrollLeft
        scrollData.scrollTop = target.scrollTop

        scrollData = Object.assign({},scrollData)
        // console.log('update scrollData',Object.assign({},scrollData))
        updateScrollData(scrollData)

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
        // scrollData.scrollLeft = scrolldiv.current.scrollLeft
        // scrollData.scrollTop = scrolldiv.current.scrollTop
        // latestScrollData = scrollData
        // scrollData = {}
        scrollData = Object.assign({},scrollData)
        // console.log('scrolling ended:scrollData',scrollData)
        updateScrollData(scrollData)
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