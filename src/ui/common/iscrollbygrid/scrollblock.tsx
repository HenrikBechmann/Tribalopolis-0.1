// scrollblock.tsx
// copyright (c) 2020 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React, {useState, useRef, useEffect, useContext} from 'react'

import { ScrollContext } from './viewport'

const Scrollblock = (props) => {
    let {size, offset, orientation:newOrientation } = props

    // console.log('scrollblock props',props)

    let scrollData:any = useContext(ScrollContext)
    let [oldOrientation, updateOrientation] = useState(null)
    let viewportRect = useRef(null)
    let divlinerstyleref = useRef({
        backgroundColor:'green',
        position:'relative',
    } as React.CSSProperties)
    let [scrollDataState,updateScrollData] = useState(scrollData)

    if (oldOrientation !== newOrientation) {
        updateScrollStyles(newOrientation,divlinerstyleref)
        updateOrientation(newOrientation)
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

const updateScrollStyles = (newOrientation,oldstyles) => {

    // console.log('setting scrollblock styles')
    let styles = Object.assign({},oldstyles.current) as React.CSSProperties
    if (newOrientation == 'horizontal') {
        styles.height = '100%'
        styles.width = '20000px'
    } else if (newOrientation == 'vertical') {
        styles.width = '100%'
        styles.height = '20000px'
    }
    oldstyles.current = styles
}

export default Scrollblock
