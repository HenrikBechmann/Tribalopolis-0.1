// scrollblock.tsx
// copyright (c) 2020 Henrik Bechmann, Toronto, Licence: MIT

import React, {useContext, useRef, useCallback, useEffect, useState} from 'react'

import { ViewportContext } from './viewport'

const Scrollblock = ({
    children,
    listsize, 
    cellHeight, 
    cellWidth, 
    gap, 
    padding, 
    orientation, 
    component, 
    styles 
}) => {

    const [genCounter,setGenCounter] = useState(null)
    const viewportData = useContext(ViewportContext)
    const scrollBlockLengthRef = useRef(null)
    const divlinerstyleRef = useRef(Object.assign({

        backgroundColor:'green',
        position:'relative',
        
    } as React.CSSProperties, styles?.cradle))

    const scrollblockRef = useRef(null)

    const generationcounterRef = useRef(0)

    let { viewportDimensions, itemobserver } = viewportData

    console.log('viewportDimensions in scrollblock', viewportDimensions)

    let { top, right, bottom, left, width, height } = viewportDimensions
    
    useEffect(() => {

        updateBlockLength()
        updateScrollblockStyles(orientation,divlinerstyleRef,scrollBlockLengthRef)
        setGenCounter(++generationcounterRef.current)

    },[orientation,height,width])

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
                        viewportheight:height,
                        viewportwidth:width,
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
            height,
            width,
         ]
    )

    return divlinerstyleRef.current.width?<div ref = {scrollblockRef} style={divlinerstyleRef.current}>{children}</div>:null

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

        crosslength = cellWidth + gap
        cellLength = cellHeight + gap
        viewportcrosslength = viewportwidth 

    } else {

        crosslength = cellHeight + gap
        cellLength = cellWidth + gap
        viewportcrosslength = viewportheight

    }
    // adjustments to viewportcrosslength
    viewportcrosslength -= (padding * 2)
    viewportcrosslength += gap

    let crosscount = Math.floor(viewportcrosslength/crosslength)

    let listlength = Math.ceil(listsize/crosscount)

    let straightlength = (listlength * cellLength) - ((listlength > 0)?gap:0) + (padding * 2)

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
