// scrollblock.tsx
// copyright (c) 2020 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React, {useState, useRef, useEffect, useContext} from 'react'

import { ScrollContext } from './viewport'

const Scrollblock = (props) => {
    let {listsize, cellLength, cellCrossLength, crossLengthHint, gap, padding, orientation:newOrientation } = props

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
        // console.log('useEffect in scrollblock',scrollData?.viewportRect,newOrientation,listsize,cellLength,cellCrossLength,crossLengthHint,gap,padding)
        updateConfiguration({viewportRect:scrollData?.viewportRect,orientation:newOrientation,listsize,cellLength,cellCrossLength,crossLengthHint,gap,padding})
        updateScrollblockStyles(newOrientation,divlinerstyleref,scrollBlockLength)
        updateOrientation(newOrientation)
    },[scrollData?.viewportRect,newOrientation,listsize,cellLength,cellCrossLength,crossLengthHint,gap,padding,scrollBlockLength])

    useEffect(() => {
        updateData(scrollData)
        updateScrollData(scrollData)
    },[scrollData])

    const updateConfiguration = ({viewportRect,orientation,listsize,cellLength,cellCrossLength,crossLengthHint,gap,padding}) => {
        // console.log('updateCongiguration',viewportRect,orientation,listsize,cellLength,cellCrossLength,crossLengthHint,gap,padding)
        if (!viewportRect) return
        let scrollblocklength = calcScrollblockLength({listsize,cellLength,cellCrossLength,crossLengthHint,gap,padding,orientation, viewportRect})
        // console.log('INSIDE UPDATECONFIGURATION: scrollblocklength,listsize,cellLength,cellCrossLength,crossLengthHint,gap,padding,orientation,viewportRect',scrollblocklength,listsize,cellLength,cellCrossLength,crossLengthHint,gap,padding,orientation,viewportRect)
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
    cellLength, 
    cellCrossLength, 
    crossLengthHint, 
    gap, 
    padding, 
    orientation, 
    viewportRect
    }) => {

    // console.log('calcScrollblockLength incoming',
    // listsize, 
    // cellLength, 
    // cellCrossLength, 
    // crossLengthHint, 
    // gap, 
    // padding, 
    // orientation, 
    // viewportRect
    // )

    let viewportcrosslength 

    if (orientation == 'vertical') {
        viewportcrosslength = viewportRect.right - viewportRect.left 
    } else {
        viewportcrosslength = viewportRect.bottom - viewportRect.top
    }

    viewportcrosslength -= (padding * 2)
    viewportcrosslength += gap

    let crosslength = cellCrossLength || crossLengthHint

    let crosscount = Math.floor(viewportcrosslength/(crosslength + gap))

    let listlength = Math.floor(listsize/crosscount)

    let listremainder = listsize % crosscount

    if (listremainder) {
        listlength ++
    }

    let straightlength = (listlength * cellLength) + ((listsize -1) * gap) + (padding * 2)

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
