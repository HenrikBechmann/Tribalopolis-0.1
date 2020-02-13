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

    const scrolldiv = useRef(undefined)
    const divlinerstyleRef = useRef({
        position:'absolute',
        height:'100%',
        width:'100%',
        overflow:'auto',
        backgroundColor:'red',
    })
    const [viewportData,setViewportData] = useState(null)
    const observerRef = useRef(null)

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

        observerRef.current = observer

        let localViewportData:GenericObject = {}
        localViewportData.viewportRect = scrolldiv.current.getBoundingClientRect()
        localViewportData.observer = observer

        setViewportData(localViewportData)

    },[orientation])

    let divlinerstyle = divlinerstyleRef.current as React.CSSProperties

    // console.log('rendering viewport', scrolldiv.current,viewportData?.viewportRect.top)

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