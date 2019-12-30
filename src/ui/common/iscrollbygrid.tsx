// infinitescroller.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React, {useContext, useState, useRef, useEffect, useLayoutEffect} from 'react'

import { GenericObject } from '../../services/interfaces'

/*
use grid

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

attributes
    pattern = stream|grid|masonry
    trackcount = <number of side by side>
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

*/

/*

    Sections are:
     - INITIALIZE
     - VIEWPORT
     - SCROLLBLOCK
     - CRADLE
     - ITEMFRAME

*/

// ===================================[ INITIALIZE ]===========================

const SCROLL_DIFF_FOR_UPDATE = 20
const SCROLL_TIMEOUT_FOR_ONAFTERSCROLL = 250
const RESIZE_TIMEOUT_FOR_ONAFTERSRESIZE = 250

const ScrollContext = React.createContext(null)

// ===============================[ VIREWPORT ]===========================

const Viewport = (props) => {
    let [scrollData, updateScrollData] = useState(null)
    let scrolldiv:any = useRef()
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
             // console.log('running useEffect:scrolldiv, scrollData',scrolldiv, scrollData)
    },[])

    let divlinerstyle = divlinerstyleref.current as React.CSSProperties
    // console.log('starting ViewPort', scrollData)

    const onDoResize = () => {
        // console.log('onResize', scrollData)
        scrollData.viewportRect = scrolldiv.current.getBoundingClientRect()
        scrollData = Object.assign({},scrollData)
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
        // console.log('scrolling ended:scrollData',scrollData)
    }

    return <ScrollContext.Provider value = {scrollData}><div 
        style = {divlinerstyle}
        onScroll = {onScroll}
        ref = {scrolldiv}
    >{props.children}</div></ScrollContext.Provider>
    
} // Viewport

// ==================================[ SCROLLBLOCK ]================================

const Scrollblock = (props) => {
    let {size, offset, dimensions, pattern, direction:newDirection } = props

    // console.log('scrollblock props',props)

    let scrollData = useContext(ScrollContext)
    let [oldDirection, updateDirection] = useState(null)
    let viewportRect = useRef(null)
    let divlinerstyleref = useRef({
        backgroundColor:'green',
        position:'relative',
    } as React.CSSProperties)
    let [scrollDataState,updateScrollData] = useState(scrollData)

    if (oldDirection !== newDirection) {
        updateScrollStyles(newDirection,divlinerstyleref)
        updateDirection(newDirection)
    }

    // console.log('Scrollblock scrollData, viewportRect',scrollData, viewportRect)

    useEffect(() => {
        viewportRect.current = scrollData?.viewportRect
        updateConfiguration(scrollData,viewportRect)
    },[scrollData?.viewportRect,viewportRect?.current])

    useEffect(() => {
        updateData(scrollData)
        updateScrollData(scrollData)
    },[scrollData])

    const updateConfiguration = (sData,vRect) => {
        if (!sData) return

        // console.log('INSIDE UPDATECONFIGURATION:scrollData,viwportRect',sData,vRect)
    }

    const updateData = (sData) => {
        if (!sData) return

        // console.log('INSIDE UPDATEDATA: scrollData',sData)
    }

    return <div style={divlinerstyleref.current}>{props.children}</div>

} // Scrollblock

const updateScrollStyles = (newDirection,oldstyles) => {

    // console.log('setting scrollblock styles')
    let styles = Object.assign({},oldstyles.current) as React.CSSProperties
    if (newDirection == 'horizontal') {
        styles.height = '100%'
        styles.width = '20000px'
    } else if (newDirection == 'vertical') {
        styles.width = '100%'
        styles.height = '20000px'
    }
    oldstyles.current = styles
}


// ================================[ CREADLE ]=======================================

const Cradle = (props) => {
    let { runway, size, offset, dimensions, pattern, direction:newDirection, getItem, placeholders } = props

    // console.log('cradle props',props)

    let divlinerstyleref = useRef({
        position:'absolute',
        backgroundColor:'blue',
        display:'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gridGap: '10px',
        padding:'10px'

    } as React.CSSProperties)

    let [oldDirection, updateDirection] = useState(null)

    let childlistref = useRef([])

    if (newDirection !== oldDirection) {
        updateCradleStyles(newDirection, divlinerstyleref)
        updateDirection(newDirection)
    }

    useEffect(() =>{
        childlistref.current = getContent({
            direction:newDirection,
            contentdata:['item 1','item 2','item 3','item 4','item 5',]
        })

    },[newDirection,childlistref])

    let divlinerstyles = divlinerstyleref.current

    return <div style = {divlinerstyles}>{childlistref.current}</div>

} // Cradle

const updateCradleStyles = (newDirection, oldStyles) => {

        let styles = Object.assign({},oldStyles.current) as React.CSSProperties
        if (newDirection == 'horizontal') {
            styles.left = 0
            styles.right = 'auto'
            styles.top = 0
            styles.bottom = 0
            styles.gridAutoFlow = 'column'
            styles.gridTemplateRows = 'repeat(auto-fill, minmax(100px, 1fr))'
            styles.gridTemplateColumns = 'none'
        } else if (newDirection == 'vertical') {
            styles.left = 0
            styles.right = 0
            styles.top = 0
            styles.bottom = 'auto'
            styles.gridAutoFlow = 'row'
            styles.gridTemplateRows = 'none'
            styles.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))'
        }
        oldStyles.current = styles
}

const getContent = (props) => {
    let { contentdata, direction } = props
    let contentlist = []
    for (let index = 0; index <5; index++) {
        contentlist.push(<ItemFrame 
            key = {index} 
            direction = {direction}
            text =  {contentdata[index]
        }/>)
    }
    return contentlist
}

// =============================[ ITEMFRAME ]===============================

const ItemFrame = (props) => {
    let {text, direction:newDirection} = props
    let styles = useRef({ // use useRef() instead
        boxSizing:'border-box',
        backgroundColor:'cyan',
        border:'2px solid black',
        // default vertical
        height:'125px',
        width:'auto',
    } as React.CSSProperties)

    let [oldDirection, setDirection] = useState('vertical')

    // sets newDorection if different, as side effect
    if (oldDirection !== newDirection) {
    
        updateFrameStyles(newDirection, styles)

        setDirection(newDirection)
    }

    // console.log('RUNNING styles',styles)

    return <div style = {styles.current}>{text}</div>
}

const updateFrameStyles = (newDirection, oldstyles) => {

    // console.log('inside updateStyles: oldDirection, newDirection, oldstyles',oldDirection, newDirection, oldstyles)

    let styleset:React.CSSProperties = Object.assign({},oldstyles.current)

    if (newDirection == 'horizontal') {
        styleset.width = '125px'
        styleset.height = 'auto'
    } else if (newDirection === 'vertical') {
        styleset.height = '125px'
        styleset.width = 'auto'
    }
    oldstyles.current = styleset
    // setDirection(newDirection)
    // console.log('new styleset',styleset, oldstyles)
}


const IScrollByGrid = (props) => {
    let { runway, size, offset, dimensions, pattern, direction, getItem, placeholders, wrapcount } = props
    // console.log('inside Scroller')

    if (!['horizontal','vertical'].includes(direction)) {
        console.warn('invalid value for scroller direction; resetting to default',direction)
        direction = 'horizontal'
    }
    if (!['stream'].includes(pattern)) { // future grid or masonry
        if (pattern) {
            console.warn('invalid value for scroller pattern; resetting to default',pattern)
        }
        pattern = 'stream'
    }

    runway !?? (runway = 5)
    offset !?? (offset = 0)
    size !?? (size = 0)
    !wrapcount && (wrapcount = 1)

    return <Viewport>
        <Scrollblock

            size = { size }
            wrapcount = { wrapcount }
            offset = { offset }
            pattern = { pattern }
            direction = { direction }

            dimensions = { dimensions }
        >

            <Cradle 

                size = { size }
                wrapcount = { wrapcount }
                offset = { offset }
                pattern = { pattern }
                direction = { direction }
                runway = { runway } 

                dimensions = { dimensions }
                placeholders = { placeholders }
                getItem = { getItem }

            />

        </Scrollblock>
    </Viewport>

}

export default IScrollByGrid
