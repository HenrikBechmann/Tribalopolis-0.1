// cradle.tsx
// copyright (c) 2020 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React, { useState, useRef, useContext, useEffect, useCallback } from 'react'

import { ViewportContext } from './viewport'

import ItemShell from './itemshell'

const Cradle = (props) => {

    // console.log('running cradle',props)
    const { gap, padding, runway, listsize, offset, orientation, cellHeight, cellWidth, getItem, placeholder } = props

    const state = useState('setup')

    const viewportData = useContext(ViewportContext)

    const [contentlist,saveContentlist] = useState([])

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

    let { viewportRect } = viewportData
    let { top, right, bottom, left } = viewportRect

    let viewportheight = bottom - top
    let viewportwidth = right - left

    // fired when the configuration parameters of the cradle change
    useEffect(() => {
        // console.log('useEffect in cradle')
        // workaround to get FF to correctly size grid container for horizontal orientation
        // crosscount is ignored for vertical orientation
        let crosscount = getCrosscount(orientation,padding,gap,cellWidth,cellHeight,viewportheight, viewportwidth)

        setCradleStyles(orientation, divlinerstyleref, cellHeight, cellWidth, crosscount, viewportheight, viewportwidth)
        setCradleContent()

    },[
        orientation,
        cellHeight,
        cellWidth,
        gap,
        padding,
        viewportheight,
        viewportwidth,
      ]
    )

    // console.log('cradle scrollLeft, scrollTop, scrolling',scrollLeft, scrollTop, scrolling)

    const setCradleContent = useCallback(() => {

        let newContentList = [...contentlist]

        let {indexoffset, headindexcount, tailindexcount} = evaluateChildList()

        let childlistfragment = getContentList({
            orientation,
            indexoffset,
            headindexcount,
            tailindexcount,
            cellHeight,
            cellWidth,
            newContentList,
        })
        saveContentlist(childlistfragment)
        // console.log('childlistfragment',childlistfragment)
    },[
        orientation,
        cellHeight,
        cellWidth,
        contentlist,
        cradleElement,
      ]
    )

    const evaluateChildList = useCallback(() => {
        let indexoffset = 0, headindexcount = 100, tailindexcount = 0

        return {indexoffset, headindexcount, tailindexcount}
    },[orientation, viewportData,cradleElement])

    let divlinerstyles = divlinerstyleref.current

    // console.log('cradle width',divlinerstyles.width)
    // no result if styles not set
    return divlinerstyles.width?<div ref = {cradleElement} style = {divlinerstyles}>{contentlist}</div>:null

} // Cradle


const getCrosscount = (orientation, padding, gap, cellWidth, cellHeight, viewportlength, viewportwidth) => {

    let crosscount
    let size = (orientation == 'horizontal')?viewportlength:viewportwidth
    let crossLength = (orientation == 'horizontal')?cellHeight:cellWidth

    let lengthforcalc = size - (padding * 2) + gap
    crosscount = Math.floor(lengthforcalc/(crossLength + gap))

    return crosscount

}

const setCradleStyles = (orientation, stylesobject, cellHeight, cellWidth, crosscount,viewportheight, viewportwidth) => {

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
    let { indexoffset, headindexcount, tailindexcount, orientation, cellHeight, cellWidth, newContentList } = props
    let contentlist = []
    headindexcount = 10
    for (let index = indexoffset + 1; index <(indexoffset + headindexcount + 1); index++) {
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