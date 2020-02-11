// viewport.tsx
// copyright (c) 2020 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

/*
    The role of viewport is to provide data to its children (cradle)
*/

'use strict'

import React, {useState, useRef, useEffect, useLayoutEffect} from 'react'

import { GenericObject } from '../../../services/interfaces'

export const ViewportContext = React.createContext(null)

// control constants
const SCROLL_DIFF_FOR_UPDATE = 20
const SCROLL_TIMEOUT_FOR_ONAFTERSCROLL = 250
const RESIZE_TIMEOUT_FOR_ONAFTERSRESIZE = 250

const Viewport = ({children, orientation}) => { // props

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
    let viewportDataRef = useRef(null)

    useEffect(() => {

        let rootMargin
        if (orientation == 'horizontal') {
            rootMargin = '0px 800px 0px 800px'
        } else {
            rootMargin = '800px 0px 800px 0px'
        }
        let observer = new IntersectionObserver((entries) => {
            console.log('observing entries',entries)
        },{root:scrolldiv.current, rootMargin,} )

        let localViewportData:GenericObject = {}
        localViewportData.viewportRect = scrolldiv.current.getBoundingClientRect()
        localViewportData.observer = observer

        viewportDataRef.current = localViewportData

    },[orientation])

    let divlinerstyle = divlinerstyleref.current as React.CSSProperties

    return <ViewportContext.Provider value = { viewportDataRef.current }>
        <div 
            style = {divlinerstyle}
            ref = {scrolldiv}
        >
            { children }
        </div>}
    </ViewportContext.Provider>
    
} // Viewport

export default Viewport