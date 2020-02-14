// scrollblock.tsx
// copyright (c) 2020 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React, {useContext, useRef, useCallback, useLayoutEffect} from 'react'

import { ViewportContext } from './viewport'

// TODO: needs to recalculate with resize

// Scrollblock is naturally called twice by viewport rerenders and viewportData updates
// this succeeds in rendering changes with with the userEffect
// Ideally the component would behave independent of external bbehaviour

const Scrollblock = (props) => {

    const {listsize, cellHeight, cellWidth, gap, padding, orientation } = props

    const viewportData = useContext(ViewportContext)
    const scrollBlockLengthRef = useRef(null)
    const divlinerstyleRef = useRef({

        backgroundColor:'green',
        position:'relative',
        
    } as React.CSSProperties)

    // console.log('scrollBlockLengthRef.current',scrollBlockLengthRef.current)

    let { viewportRect, itemobserver } = viewportData

    let { top, right, bottom, left } = viewportRect

    let viewportheight = bottom - top
    let viewportwidth = right - left
    
    useLayoutEffect(() => {

        // console.log('running useEffect in scrollblock',orientation)
        updateBlockLength()
        updateScrollblockStyles(orientation,divlinerstyleRef,scrollBlockLengthRef)

    },[orientation,viewportheight,viewportwidth])

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
            viewportRect
         ]
    )

    // console.log('rendering scrollblock',viewportData.itemobserver.rootMargin, divlinerstyleRef.current.width)

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
