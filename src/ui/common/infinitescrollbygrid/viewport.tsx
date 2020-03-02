// viewport.tsx
// copyright (c) 2020 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

/*
    The role of viewport is to provide data to its children (cradle)
*/

'use strict'

import React, {useState, useRef, useEffect, useLayoutEffect, useCallback} from 'react'

import { GenericObject } from '../../../services/interfaces'

export const ViewportContext = React.createContext(null)

import './infinitescrollbygrid.css'

// control constants
const SCROLL_DIFF_FOR_UPDATE = 20
const SCROLL_TIMEOUT_FOR_ONAFTERSCROLL = 250
const RESIZE_TIMEOUT_FOR_ONAFTERSRESIZE = 250

// TODO: global vars should be instance vars

let sizegenerationcounter = 0
let timeoutid

const Viewport = ({children, orientation, runwaylength}) => { // props

    const scrolldiv = useRef(undefined)
    const divlinerstyleRef = useRef({
        position:'absolute',
        height:'100%',
        width:'100%',
        overflow:'auto',
        backgroundColor:'red',
        scrollbarWidth:'none',
    })
    const [viewportData,setViewportData] = useState(null)

    const [sizegencounter,setGencounter] = useState(0)

    const handleResize = () => {

        clearTimeout(timeoutid)
        timeoutid = setTimeout(() => {

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

        let localViewportData:GenericObject = {}
        localViewportData.viewportRect = scrolldiv.current.getBoundingClientRect()
        localViewportData.elementref = scrolldiv

        setViewportData(localViewportData)

    },[orientation])

    useEffect(() => {

        if (!viewportData) return

        let localViewportData = {...viewportData}
        localViewportData.viewportRect = scrolldiv.current.getBoundingClientRect()

        setViewportData(localViewportData)

    },[sizegenerationcounter])

    let divlinerstyle = divlinerstyleRef.current as React.CSSProperties

    return <ViewportContext.Provider value = { viewportData }>
        <div 
            style = {divlinerstyle}
            ref = {scrolldiv}
            className = 'invisiblescrollbar'
        >
            { viewportData?children:null }
        </div>}
    </ViewportContext.Provider>
    
} // Viewport

export default Viewport