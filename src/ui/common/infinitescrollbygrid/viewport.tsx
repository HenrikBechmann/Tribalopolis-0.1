// viewport.tsx
// copyright (c) 2020 Henrik Bechmann, Toronto, Licence: MIT

/*
    The role of viewport is to provide data to its children (cradle)
*/

import React, {useState, useRef, useEffect, useMemo} from 'react'

import { GenericObject } from '../../../services/interfaces'

export const ViewportContext = React.createContext(null)

// control constants
const SCROLL_DIFF_FOR_UPDATE = 20
const SCROLL_TIMEOUT_FOR_ONAFTERSCROLL = 250
const RESIZE_TIMEOUT_FOR_ONAFTERSRESIZE = 250

const Viewport = ({
    children, 
    orientation, 
    cellWidth, 
    cellHeight, 
    gap, 
    padding, 
    component, 
    styles,
}) => {

    const sizegenerationcounterRef = useRef(0)
    const timeoutidRef = useRef(null)
    const viewportdivRef = useRef(undefined)
    const divlinerstyleRef = useRef(
        Object.assign({
        position:'absolute',
        height:'100%',
        width:'100%',
        overflow:'auto',
        backgroundColor:'red',
    } as React.CSSProperties,styles?.viewport))

    divlinerstyleRef.current = useMemo(() => {
        let mincrosslength = calcMinViewportCrossLength(orientation, cellWidth, cellHeight, padding)
        let styles = {...divlinerstyleRef.current} as React.CSSProperties
        if (orientation == 'vertical') {
            styles.minWidth = mincrosslength + 'px'
            styles.minHeight = 'auto'
        } else {
            styles.minWidth = 'auto'
            styles.minHeight = mincrosslength + 'px'
        }

        return styles

    },[orientation, cellWidth, cellHeight, padding])

    const [viewportData,setViewportData] = useState(null)

    const [sizegencounter,setGencounter] = useState(0)

    const handleResize = () => {

        clearTimeout(timeoutidRef.current)
        timeoutidRef.current = setTimeout(() => {

            setGencounter(++sizegenerationcounterRef.current)

        },500)
    }

    useEffect(() => {

        window.addEventListener('resize',handleResize)

        return () => {
            window.removeEventListener('resize',handleResize)
        }

    },[])

    // useEffect(() => {
    //     if (component?.elements.hasOwnProperty('viewportRef')) {
    //         component.elements.viewportRef = viewportdivRef
    //     }
    // },[])

    useEffect(() => {

        let localViewportData:GenericObject = {}
        localViewportData.viewportRect = viewportdivRef.current.getBoundingClientRect()
        localViewportData.elementref = viewportdivRef

        setViewportData(localViewportData)

    },[orientation])

    useEffect(() => {

        if (!viewportData) return

        let localViewportData = {...viewportData}
        localViewportData.viewportRect = viewportdivRef.current.getBoundingClientRect()

        setViewportData(localViewportData)

    },[sizegenerationcounterRef.current])

    let divlinerstyle = divlinerstyleRef.current as React.CSSProperties

    return <ViewportContext.Provider value = { viewportData }>
        <div 
            style = {divlinerstyle}
            ref = {viewportdivRef}
        >
            { viewportData?children:null }
        </div>
    </ViewportContext.Provider>
    
} // Viewport

const calcMinViewportCrossLength = (orientation, cellWidth, cellHeight, padding) => {
    let crosslength, cellLength
    if (orientation == 'vertical') {
        cellLength = cellWidth
    } else {
        cellLength = cellHeight
    }
    crosslength = cellLength + (padding * 2)
    return crosslength
}

export default Viewport