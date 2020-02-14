// cradle.tsx
// copyright (c) 2020 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React, { useState, useRef, useContext, useEffect, useCallback } from 'react'

import { ViewportContext } from './viewport'

import ItemShell from './itemshell'

const Cradle = (props) => {

    // console.log('running cradle',props)
    const { gap, padding, runway, listsize, offset, orientation, cellHeight, cellWidth, getItem, placeholder } = props

    const viewportData = useContext(ViewportContext)

    const [childlist,saveChildlist] = useState([])

    const divlinerstyleref = useRef({
        position: 'absolute',
        backgroundColor: 'blue',
        display: 'grid',
        gridGap: gap + 'px',
        padding: padding + 'px',
        justifyContent:'start',
        alignContent:'start',
        boxSizing:'border-box',

    } as React.CSSProperties)

    const cradleElement = useRef(null)

    // fired when the configuration parameters of the cradle change
    useEffect(() => {
        // console.log('useEffect in cradle')
        let { viewportRect } = viewportData
        let { top, right, bottom, left } = viewportRect

        let viewportheight = bottom - top
        let viewportwidth = right - left

        // workaround to get FF to correctly size grid container for horizontal orientation
        // crosscount is ignored for vertical orientation
        let crosscount = getCrosscount(orientation,padding,gap,cellWidth,cellHeight,viewportheight, viewportwidth)

        updateCradleStyles(orientation, divlinerstyleref, cellHeight, cellWidth, crosscount, viewportheight, viewportwidth)
        updateChildList()

    },[
        orientation,
        cellHeight,
        cellWidth,
        gap,
        padding,
      ]
    )

    // console.log('cradle scrollLeft, scrollTop, scrolling',scrollLeft, scrollTop, scrolling)

    const updateChildList = useCallback(() => {

        let newChildList = [...childlist]

        let {indexoffset, indexcount} = evaluateChildList()

        let childlistfragment = getContentList({
            orientation,
            indexoffset,
            indexcount,
            cellHeight,
            cellWidth,
        })
        saveChildlist(childlistfragment)
        // console.log('childlistfragment',childlistfragment)
    },[
        orientation,
        cellHeight,
        cellWidth,
        childlist,
        cradleElement,
      ]
    )

    const evaluateChildList = useCallback(() => {
        let indexoffset = 0, indexcount = 100

        return {indexoffset, indexcount}
    },[orientation, viewportData,cradleElement])

    let divlinerstyles = divlinerstyleref.current

    // console.log('cradle width',divlinerstyles.width)
    // no result if styles not set
    return divlinerstyles.width?<div ref = {cradleElement} style = {divlinerstyles}>{childlist}</div>:null

} // Cradle


const getCrosscount = (orientation, padding, gap, cellWidth, cellHeight, viewportlength, viewportwidth) => {

    let crosscount
    let size = (orientation == 'horizontal')?viewportlength:viewportwidth
    let crossLength = (orientation == 'horizontal')?cellHeight:cellWidth

    let lengthforcalc = size - (padding * 2) + gap
    crosscount = Math.floor(lengthforcalc/(crossLength + gap))

    return crosscount

}

const updateCradleStyles = (orientation, stylesobject, cellHeight, cellWidth, crosscount,viewportheight, viewportwidth) => {

        // console.log('Cradle updateCradleStyles',orientation)

        let styles = Object.assign({},stylesobject.current) as React.CSSProperties
        if (orientation == 'horizontal') {
            styles.width = 'auto'
            styles.height = '100%'
            styles.gridAutoFlow = 'column'
            // explict crosscount next line as workaround for FF problem - 
            //     sets length of horiz cradle items in one line (row), not multi-row config
            styles.gridTemplateRows = cellHeight?`repeat(${crosscount}, minmax(${cellHeight}px, 1fr))`:'auto'
            styles.gridTemplateColumns = 'none'
            styles.minWidth = viewportwidth + 'px'
            styles.minHeight = 0
        } else if (orientation == 'vertical') {
            styles.width = '100%'
            styles.height = 'auto'
            styles.gridAutoFlow = 'row'
            styles.gridTemplateRows = 'none'
            styles.gridTemplateColumns = cellWidth?`repeat(auto-fit, minmax(${cellWidth}px, 1fr))`:'auto'
            styles.minWidth = 0
            styles.minHeight = viewportheight + 'px'
        }
        // console.log('updated style', styles)
        stylesobject.current = styles
}

const getContentList = (props) => {
    let { indexoffset, indexcount, orientation, cellHeight, cellWidth } = props
    let contentlist = []
    indexcount = 10
    for (let index = indexoffset + 1; index <(indexoffset + indexcount + 1); index++) {
        contentlist.push(<ItemShell
            key = {index} 
            orientation = {orientation}
            text = { index }
            cellHeight = { cellHeight }
            cellWidth = { cellWidth }
            index = {index}
        />)
    }
    return contentlist
}

export default Cradle