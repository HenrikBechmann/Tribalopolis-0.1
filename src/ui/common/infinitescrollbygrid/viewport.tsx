// viewport.tsx
// copyright (c) 2020 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

/*
    The role of viewport is to provide data to its children (cradle)
*/

'use strict'

import React, {useState, useRef, useEffect, useLayoutEffect, useCallback} from 'react'

import { GenericObject } from '../../../services/interfaces'

export const ViewportContext = React.createContext(null)

// control constants
const SCROLL_DIFF_FOR_UPDATE = 20
const SCROLL_TIMEOUT_FOR_ONAFTERSCROLL = 250
const RESIZE_TIMEOUT_FOR_ONAFTERSRESIZE = 250

// TODO: global vars should be instance vars

let sizegenerationcounter = 0
let timeoutid

const Viewport = ({children, orientation, runway}) => { // props

    const scrolldiv = useRef(undefined)
    const divlinerstyleRef = useRef({
        position:'absolute',
        height:'100%',
        width:'100%',
        overflow:'auto',
        backgroundColor:'red',
    })
    const [viewportData,setViewportData] = useState(null)

    const [sizegencounter,setGencounter] = useState(0)

    const handleResize = () => {
        // console.log('handling resize',sizegenerationcounter,timeoutid)
        clearTimeout(timeoutid)
        timeoutid = setTimeout(() => {
            // console.log('running timeout')
            setGencounter(++sizegenerationcounter)
        },500)
    }

    useEffect(() => {

        window.addEventListener('resize',handleResize)

        return () => {
            window.removeEventListener('resize',handleResize)
        }

    },[])

    useEffect(() => {

        let rootMargin
        if (orientation == 'horizontal') {
            rootMargin = `0px ${runway}px 0px ${runway}px`
        } else {
            rootMargin = `${runway}px 0px ${runway}px 0px`
        }
        // console.log('rootMargin',rootMargin)
        let itemobserver = new IntersectionObserver((entries) => {
            // console.log('observing entries',entries)
        },{root:scrolldiv.current, rootMargin,} )

        let localViewportData:GenericObject = {}
        localViewportData.viewportRect = scrolldiv.current.getBoundingClientRect()
        localViewportData.itemobserver = itemobserver

        // console.log('localViewportData',localViewportData)

        setViewportData(localViewportData)

    },[orientation])

    useEffect(() => {
        if (!viewportData) return
        // console.log('updating viewportRect', sizegenerationcounter, viewportData)
        let localViewportData = {...viewportData}
        localViewportData.viewportRect = scrolldiv.current.getBoundingClientRect()
        // console.log('gencounter useEffect localviewportData',localViewportData.viewportRect.right,localViewportData.viewportRect.bottom,localViewportData)
        setViewportData(localViewportData)
    },[sizegenerationcounter])

    let divlinerstyle = divlinerstyleRef.current as React.CSSProperties

    // console.log('rendering viewport', scrolldiv.current,viewportData?.viewportRect.right,viewportData?.viewportRect.bottom)

    return <ViewportContext.Provider value = { viewportData }>
        <div 
            style = {divlinerstyle}
            ref = {scrolldiv}
        >
            { viewportData?children:null }
        </div>}
    </ViewportContext.Provider>
    
} // Viewport

export default Viewport