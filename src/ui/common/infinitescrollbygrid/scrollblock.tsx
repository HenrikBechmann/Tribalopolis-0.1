// scrollblock.tsx
// copyright (c) 2020 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React, {useState, useRef, useEffect, useContext} from 'react'

import { ScrollContext } from './viewport'

const Scrollblock = (props) => {
    let {listsize, cellHeight, cellWidth, crossLengthHint, gap, padding, orientation:newOrientation } = props

    let scrollData:any = useContext(ScrollContext)
    let [oldOrientation, updateOrientation] = useState(null)
    let [scrollBlockLength, updateScrollBlockLength] = useState(0)
    let scrollblockRect = useRef(null)
    let divlinerstyleref = useRef({
        backgroundColor:'green',
        position:'relative',
    } as React.CSSProperties)
    let [scrollDataState,updateScrollData] = useState(scrollData)

    // console.log('scrollblock: props, scrolldata', props, scrollData)

    // if (oldOrientation !== newOrientation) {
    // }

    // console.log('Scrollblock scrollData, viewportRect',scrollData, viewportRect)

    useEffect(() => {
        // console.log('useEffect in scrollblock',scrollData?.viewportRect,newOrientation,listsize,cellHeight,cellWidth,crossLengthHint,gap,padding)
        updateConfiguration({viewportRect:scrollData?.viewportRect,orientation:newOrientation,listsize,cellHeight,cellWidth,gap,padding})
        updateScrollblockStyles(newOrientation,divlinerstyleref,scrollBlockLength)
        updateOrientation(newOrientation)
    },[scrollData?.viewportRect,newOrientation,listsize,cellHeight,cellWidth,crossLengthHint,gap,padding,scrollBlockLength])

    useEffect(() => {
        updateData(scrollData)
        updateScrollData(scrollData)
    },[scrollData])

    const updateConfiguration = ({viewportRect,orientation,listsize,cellHeight,cellWidth,gap,padding}) => {
        // console.log('updateCongiguration',viewportRect,orientation,listsize,cellHeight,cellWidth,crossLengthHint,gap,padding)
        if (!viewportRect) return
        let scrollblocklength = calcScrollblockLength({listsize,cellHeight,cellWidth,gap,padding,orientation, viewportRect})
        // console.log('INSIDE UPDATECONFIGURATION: scrollblocklength,listsize,cellHeight,cellWidth,crossLengthHint,gap,padding,orientation,viewportRect',scrollblocklength,listsize,cellHeight,cellWidth,crossLengthHint,gap,padding,orientation,viewportRect)
        updateScrollBlockLength(scrollblocklength)
    }

    const updateData = (sData) => {
        if (!sData) return

        // console.log('INSIDE UPDATEDATA: scrollData',sData)
    }

    return <div style={divlinerstyleref.current}>{props.children}</div>

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

    // console.log('calcScrollblockLength incoming',
    // listsize, 
    // cellHeight, 
    // cellWidth, 
    // crossLengthHint, 
    // gap, 
    // padding, 
    // orientation, 
    // viewportRect
    // )

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

    return straightlength

}

const updateScrollblockStyles = (newOrientation,oldstyles,scrollblocklength) => {

    // console.log('setting scrollblock styles',scrollblocklength)
    let styles = Object.assign({},oldstyles.current) as React.CSSProperties
    if (newOrientation == 'horizontal') {
        styles.height = '100%'
        styles.width = scrollblocklength + 'px'
    } else if (newOrientation == 'vertical') {
        styles.height = scrollblocklength + 'px'
        styles.width = '100%'
    }
    oldstyles.current = styles
}

export default Scrollblock
