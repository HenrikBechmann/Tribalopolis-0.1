// scrollblock.tsx
// copyright (c) 2020 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

/*
    TODO: scrollblock length calculation is off (one short) for vertical
*/

'use strict'

import React, {useContext, useRef, useCallback, useEffect, useState} from 'react'

import { ViewportContext } from './viewport'

// TODO: global vars should be instance vars

let generationcounter = 0

const Scrollblock = (props) => {

    const {listsize, cellHeight, cellWidth, gap, padding, orientation } = props

    const [genCounter,setGenCounter] = useState(null)
    const viewportData = useContext(ViewportContext)
    const scrollBlockLengthRef = useRef(null)
    const divlinerstyleRef = useRef({

        backgroundColor:'green',
        position:'relative',
        
    } as React.CSSProperties)

    let { viewportRect, itemobserver } = viewportData

    let { top, right, bottom, left } = viewportRect

    let viewportheight = bottom - top
    let viewportwidth = right - left
    
    useEffect(() => {

        updateBlockLength()
        updateScrollblockStyles(orientation,divlinerstyleRef,scrollBlockLengthRef)
        setGenCounter(++generationcounter)

    },[orientation,viewportheight,viewportwidth])

    const updateBlockLength = useCallback(
        () => {
            let scrollblocklength = 
                calcScrollblockLength(
                    {
                        listsize,
                        cellHeight,
                        cellWidth,
                        gap,
                        padding,
                        orientation, 
                        viewportheight,
                        viewportwidth,
                    }
                )

            scrollBlockLengthRef.current = scrollblocklength

        },[
            listsize,
            cellHeight,
            cellWidth,
            gap,
            padding,
            orientation, 
            viewportheight,
            viewportwidth,
         ]
    )

    return divlinerstyleRef.current.width?<div style={divlinerstyleRef.current}>{props.children}</div>:null

} // Scrollblock

// all the parameters affect the length
const calcScrollblockLength = ({
    listsize, 
    cellHeight, 
    cellWidth, 
    gap, 
    padding, 
    orientation, 
    viewportheight,
    viewportwidth,
    }) => {

    // dependents of orientation
    let crosslength
    let cellLength
    let viewportcrosslength
    if (orientation == 'vertical') {

        crosslength = cellWidth
        cellLength = cellHeight
        viewportcrosslength = viewportwidth 

    } else {

        crosslength = cellHeight
        cellLength = cellWidth
        viewportcrosslength = viewportheight

    }
    // adjustments to viewportcrosslength
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

const updateScrollblockStyles = (orientation,styles,scrollblocklengthRef) => {

    let localstyles = Object.assign({},styles.current) as React.CSSProperties
    if (orientation == 'horizontal') {
        localstyles.height = '100%'
        localstyles.width = scrollblocklengthRef.current + 'px'
    } else if (orientation == 'vertical') {
        localstyles.height = scrollblocklengthRef.current + 'px'
        localstyles.width = '100%'
    }
    styles.current = localstyles

}

export default Scrollblock
