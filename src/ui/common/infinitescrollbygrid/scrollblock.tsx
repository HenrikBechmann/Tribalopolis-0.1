// scrollblock.tsx
// copyright (c) 2020 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React, {useState, useContext, useRef, useEffect, useCallback} from 'react'

import { ViewportContext } from './viewport'

// TODO: needs to recalculate with resize

// Scrollblock is naturally called twice by viewport rerenders and viewportData updates
// this succeeds in rendering changes with with the userEffect

const Scrollblock = (props) => {

    const {listsize, cellHeight, cellWidth, gap, padding, orientation } = props

    const viewportData = useContext(ViewportContext)
    const scrollBlockLengthRef = useRef(null)
    const divlinerstyleRef = useRef({

        backgroundColor:'green',
        position:'relative',
        
    } as React.CSSProperties)

    let { viewportRect, observer } = viewportData

    useEffect(() => {

        updateBlockLength()
        updateScrollblockStyles(orientation,divlinerstyleRef,scrollBlockLengthRef)

    },[orientation])


    const updateBlockLength = useCallback(
        () => {
            // console.log('update configuration')
            let scrollblocklength = 
                calcScrollblockLength(
                    {
                        listsize,
                        cellHeight,
                        cellWidth,
                        gap,
                        padding,
                        orientation, 
                        viewportRect
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
            viewportRect
         ]
    )

        // console.log('updateCongiguration',viewportRect,orientation,listsize,cellHeight,cellWidth,crossLengthHint,gap,padding)

    // const updateData = (sData) => {
    //     if (!sData) return

    //     // console.log('INSIDE UPDATEDATA: scrollData',sData)
    // }

    // console.log('scrollblock returning element')

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
    viewportRect
    }) => {

    // dependents of orientation
    let crosslength
    let cellLength
    let viewportcrosslength
    if (orientation == 'vertical') {

        crosslength = cellWidth
        cellLength = cellHeight
        viewportcrosslength = viewportRect.right - viewportRect.left 

    } else {

        crosslength = cellHeight
        cellLength = cellWidth
        viewportcrosslength = viewportRect.bottom - viewportRect.top

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

const updateScrollblockStyles = (orientation,oldstyles,scrollblocklengthRef) => {

    let styles = Object.assign({},oldstyles.current) as React.CSSProperties
    if (orientation == 'horizontal') {
        styles.height = '100%'
        styles.width = scrollblocklengthRef.current + 'px'
    } else if (orientation == 'vertical') {
        styles.height = scrollblocklengthRef.current + 'px'
        styles.width = '100%'
    }
    oldstyles.current = styles
}

export default Scrollblock
