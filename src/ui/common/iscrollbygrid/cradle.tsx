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
    let { gap, padding, runway, listsize, offset, orientation, cellLength, cellCrossLength, getItem, placeholder } = props

    let scrollData = useContext(ScrollContext)

    let [childlist,saveChildlist] = useState([])

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

    // let childlistref = useRef([])

    let cradleElement = useRef(null)

    // fired when the configuration parameters of the cradle change
    useEffect(() => {
        let positions = scrollData?{
            top:scrollData.viewportRect.top,
            right:scrollData.viewportRect.right,
            bottom:scrollData.viewportRect.bottom,
            left:scrollData.viewportRect.left,
        }:null

        if (positions) {

            let viewportlength = positions.bottom - positions.top
            let viewportwidth = positions.right - positions.left

            // workaround to get FF to correctly size grid container for horizontal orientation
            // crosscount is ignored for vertical orientation
            let crosscount = getCrosscount(orientation,padding,gap,cellCrossLength,viewportlength, viewportwidth)

            updateCradleStyles(orientation, divlinerstyleref, cellCrossLength, crosscount)
            updateChildList()

        }
    },[
        orientation,
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

    const updateChildList = () => {

        if (!scrollData) return

        console.log('scroll updateChildList',scrollData, cradleElement)

        let subchildlist = getContentList({
            orientation,
            indexoffset:0,
            indexcount:120,
            cellLength,
        })
        saveChildlist(subchildlist)

    }

    // fired when the scroll position or scroll state changes
    useEffect(updateChildList,[scrollLeft, scrollTop, scrolling])

    let divlinerstyles = divlinerstyleref.current

    // no result if styles not set
    return divlinerstyleref.current.width?<div ref = {cradleElement} style = {divlinerstyles}>{childlist}</div>:null

} // Cradle


const getCrosscount = (orientation, padding, gap, cellCrossLength, viewportlength, viewportwidth) => {

    let crosscount
    let size = (orientation == 'horizontal')?viewportlength:viewportwidth

    let lengthforcalc = size - (padding * 2) + gap
    crosscount = Math.floor(lengthforcalc/(cellCrossLength + gap))

    return crosscount

}

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

const getContentList = (props) => {
    let { indexoffset, indexcount, orientation, cellLength } = props
    let contentlist = []
    for (let index = indexoffset + 1; index <(indexoffset + indexcount + 1); index++) {
        contentlist.push(<ItemFrame 
            key = {index} 
            orientation = {orientation}
            text = { index }
            cellLength = { cellLength }
        />)
    }
    return contentlist
}

export default Cradle