// cradle.tsx
// copyright (c) 2020 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React, { useState, useRef, useContext, useEffect } from 'react'

import { ScrollContext } from './viewport'

import ItemFrame from './itemframe'

/*
    use element.scrollWidth, element.scrollHeight

*/

const Cradle = (props) => {
    let { gap, padding, runway, listsize, offset, orientation:newOrientation, cellLength, cellCrossLength, getItem, placeholder } = props

    let scrollData = useContext(ScrollContext)

    // console.log('Cradle scrollData',scrollData)

    let divlinerstyleref = useRef({
        position: 'absolute',
        backgroundColor: 'blue',
        display: 'grid',
        gridGap: gap + 'px',
        padding: padding + 'px',
        justifyContent:'start',
        alignContent:'start',
        boxSizing:'border-box',

    } as React.CSSProperties)

    let [oldOrientation, updateOrientation] = useState(null)

    let childlistref = useRef([])

    // console.log('cradle props, oldOrientation',props, oldOrientation)

    useEffect(() => {
        let positions = scrollData?{
            top:scrollData.viewportRect.top,
            right:scrollData.viewportRect.right,
            bottom:scrollData.viewportRect.bottom,
            left:scrollData.viewportRect.left,
        }:null

        if (positions) {

            let length = positions.bottom - positions.top
            let width = positions.right - positions.left

            // workaround to get FF to correctly size grid container for horizontal orientation
            // crosscount is ignored for vertical orientation
            let crosscount
            if (newOrientation == 'horizontal') {

                let lengthforcalc = length - (padding * 2) + gap
                crosscount = Math.floor(lengthforcalc/(cellCrossLength + gap))

            }

            updateCradleStyles(newOrientation, divlinerstyleref, cellCrossLength, crosscount)

        }
        childlistref.current = getContent({
            orientation:newOrientation,
            contentdata:['item 1','item 2','item 3','item 4','item 5',],
            cellLength,
        })
        updateOrientation(newOrientation)        
    },[
        newOrientation,
        scrollData?.viewportRect.top,
        scrollData?.viewportRect.right,
        scrollData?.viewportRect.bottom,
        scrollData?.viewportRect.left,
        gap,
        padding,
      ]
    )

    let scrollLeft = scrollData?.scrollLeft
    let scrollTop = scrollData?.scrollTop
    let scrolling = scrollData?.scrolling

    // console.log('cradle scrollLeft, scrollTop, scrolling',scrollLeft, scrollTop, scrolling)

    useEffect(()=> { // respond to a scroll event
        // console.log('cradle useEffect for scroll',scrollData)
    },[scrollLeft, scrollTop, scrolling])

    let divlinerstyles = divlinerstyleref.current

    // no result if styles not set
    return divlinerstyleref.current.width?<div style = {divlinerstyles}>{childlistref.current}</div>:null

} // Cradle

const updateCradleStyles = (orientation, stylesobject, cellCrossLength, crosscount) => {

        // console.log('Cradle updateCradleStyles',positions)

        let styles = Object.assign({},stylesobject.current) as React.CSSProperties
        if (orientation == 'horizontal') {
            styles.width = 'auto'
            styles.height = '100%'
            styles.gridAutoFlow = 'column'
            // explict crosscount next line as workaround for FF problem - 
            //     sets length of horiz cradle items in one line (row), not multi-row config
            styles.gridTemplateRows = cellCrossLength?`repeat(${crosscount}, minmax(${cellCrossLength}px, 1fr))`:'auto'
            styles.gridTemplateColumns = 'none'
        } else if (orientation == 'vertical') {
            styles.width = '100%'
            styles.height = 'auto'
            styles.gridAutoFlow = 'row'
            styles.gridTemplateRows = 'none'
            styles.gridTemplateColumns = cellCrossLength?`repeat(auto-fit, minmax(${cellCrossLength}px, 1fr))`:'auto'
        }
        // console.log('updated style', styles)
        stylesobject.current = styles
}

const getContent = (props) => {
    let { contentdata, orientation, cellLength } = props
    let contentlist = []
    for (let index = 0; index <5; index++) {
        contentlist.push(<ItemFrame 
            key = {index} 
            orientation = {orientation}
            text = { contentdata[index] }
            cellLength = { cellLength }
        />)
    }
    return contentlist
}

export default Cradle