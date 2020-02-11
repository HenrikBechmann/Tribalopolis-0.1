// scrollblock.tsx
// copyright (c) 2020 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React, {useState, useRef, useEffect, useContext, useLayoutEffect} from 'react'

import { ViewportContext } from './viewport'

const Scrollblock = (props) => {

    const {listsize, cellHeight, cellWidth, gap, padding, orientation:newOrientation } = props

    const viewportData = useContext(ViewportContext)
    const [oldOrientation, updateOrientation] = useState(null)
    const scrollBlockLengthRef = useRef(null)
    const divlinerstyleref = useRef({
        backgroundColor:'green',
        position:'relative',
    } as React.CSSProperties)

    useEffect(() => {
        console.log('useLayoutEffect in scrollblock',viewportData.viewportRect,newOrientation,listsize,cellHeight,cellWidth,gap,padding)
        updateConfiguration({viewportRect:viewportData?.viewportRect,orientation:newOrientation,listsize,cellHeight,cellWidth,gap,padding})
        updateScrollblockStyles(newOrientation,divlinerstyleref,scrollBlockLengthRef)
        updateOrientation(newOrientation)
        updateData(viewportData)
    },[viewportData.viewportRect,newOrientation,listsize,cellHeight,cellWidth,gap,padding])

    const updateConfiguration = ({viewportRect,orientation,listsize,cellHeight,cellWidth,gap,padding}) => {
        // console.log('updateCongiguration',viewportRect,orientation,listsize,cellHeight,cellWidth,crossLengthHint,gap,padding)
        if (!viewportRect) return
        let scrollblocklength = calcScrollblockLength({listsize,cellHeight,cellWidth,gap,padding,orientation, viewportRect})
        console.log('INSIDE UPDATECONFIGURATION: scrollblocklength,listsize,cellHeight,cellWidth,gap,padding,orientation,viewportRect',
            scrollblocklength,listsize,cellHeight,cellWidth,gap,padding,orientation,viewportRect)
        scrollBlockLengthRef.current = scrollblocklength
    }

    const updateData = (sData) => {
        if (!sData) return

        // console.log('INSIDE UPDATEDATA: scrollData',sData)
    }

    // console.log('divlinerstyleref.current to styles',styles)

    return divlinerstyleref.current.width?<div style={divlinerstyleref.current}>{props.children}</div>:null

} // Scrollblock

const calcScrollblockLength = ({
    listsize, 
    cellHeight, 
    cellWidth, 
    gap, 
    padding, 
    orientation, 
    viewportRect
    }) => {

    let viewportcrosslength
    let crosslength
    let cellLength
    if (orientation == 'vertical') {
        crosslength = cellWidth
        cellLength = cellHeight
        viewportcrosslength = viewportRect.right - viewportRect.left 
    } else {
        crosslength = cellHeight
        cellLength = cellWidth
        viewportcrosslength = viewportRect.bottom - viewportRect.top
    }

    viewportcrosslength -= (padding * 2)
    viewportcrosslength += gap

    let crosscount = Math.floor(viewportcrosslength/(crosslength))

    let listlength = Math.floor(listsize/crosscount)

    let listremainder = listsize % crosscount

    if (listremainder) {
        listlength ++
    }

    let straightlength = (listlength * cellLength) + ((listlength -1) * gap) + (padding * 2)

    console.log('straightlength:straightlength,listlength, cellLength,gap,padding',straightlength,listlength, cellLength,gap,padding)

    return straightlength

}

const updateScrollblockStyles = (newOrientation,oldstyles,scrollblocklengthRef) => {

    let styles = Object.assign({},oldstyles.current) as React.CSSProperties
    if (newOrientation == 'horizontal') {
        styles.height = '100%'
        styles.width = scrollblocklengthRef.current + 'px'
    } else if (newOrientation == 'vertical') {
        styles.height = scrollblocklengthRef.current + 'px'
        styles.width = '100%'
    }
    oldstyles.current = styles
    console.log('setting scrollblock styles',scrollblocklengthRef, oldstyles, styles)
}

export default Scrollblock
