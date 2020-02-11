// scrollblock.tsx
// copyright (c) 2020 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React, {useState, useRef, useEffect, useContext, useLayoutEffect} from 'react'

import { ViewportContext } from './viewport'

const Scrollblock = (props) => {

    const {listsize, cellHeight, cellWidth, gap, padding, orientation:newOrientation } = props

    const viewportData = useContext(ViewportContext)
    const [oldOrientation, updateOrientation] = useState(null)
    const [scrollBlockLength, updateScrollBlockLength] = useState(null)
    const divlinerstyleref = useRef({
        backgroundColor:'green',
        position:'relative',
    } as React.CSSProperties)
    const [scrollDataState,updateScrollData] = useState(viewportData)

    // console.log('Scrollblock viewportData.viewportRect, observer',
    //     viewportData.viewportRect,
    //     viewportData.observer,
    //     !!viewportData.viewportRect,
    //     !!viewportData.observer)

    useLayoutEffect(() => {
        console.log('useLayoutEffect in scrollblock',viewportData.viewportRect,newOrientation,listsize,cellHeight,cellWidth,gap,padding)
        updateConfiguration({viewportRect:viewportData?.viewportRect,orientation:newOrientation,listsize,cellHeight,cellWidth,gap,padding})
        updateScrollblockStyles(newOrientation,divlinerstyleref,scrollBlockLength)
        updateOrientation(newOrientation)

    },[viewportData.viewportRect,newOrientation,listsize,cellHeight,cellWidth,gap,padding,scrollBlockLength])

    useEffect(() => {
        updateData(viewportData)
        updateScrollData(viewportData)
    },[viewportData])

    const updateConfiguration = ({viewportRect,orientation,listsize,cellHeight,cellWidth,gap,padding}) => {
        // console.log('updateCongiguration',viewportRect,orientation,listsize,cellHeight,cellWidth,crossLengthHint,gap,padding)
        if (!viewportRect) return
        let scrollblocklength = calcScrollblockLength({listsize,cellHeight,cellWidth,gap,padding,orientation, viewportRect})
        console.log('INSIDE UPDATECONFIGURATION: scrollblocklength,listsize,cellHeight,cellWidth,crossLengthHint,gap,padding,orientation,viewportRect',scrollblocklength,listsize,cellHeight,cellWidth,gap,padding,orientation,viewportRect)
        updateScrollBlockLength(scrollblocklength)
    }

    const updateData = (sData) => {
        if (!sData) return

        // console.log('INSIDE UPDATEDATA: scrollData',sData)
    }

    let styles = Object.assign({},divlinerstyleref.current)
    console.log('scrollblock styles.width',styles.width)

    // console.log('divlinerstyleref.current to styles',styles)

    return styles.width?<div style={styles}>{props.children}</div>:null

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

const updateScrollblockStyles = (newOrientation,oldstyles,scrollblocklength) => {

    let styles = Object.assign({},oldstyles.current) as React.CSSProperties
    if (newOrientation == 'horizontal') {
        styles.height = '100%'
        styles.width = scrollblocklength + 'px'
    } else if (newOrientation == 'vertical') {
        styles.height = scrollblocklength + 'px'
        styles.width = '100%'
    }
    oldstyles.current = styles
    console.log('setting scrollblock styles',scrollblocklength, oldstyles, styles)
}

export default Scrollblock
