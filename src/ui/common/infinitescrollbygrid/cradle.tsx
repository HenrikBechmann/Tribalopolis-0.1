// cradle.tsx
// copyright (c) 2020 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React, { useState, useRef, useContext, useEffect, useCallback, useMemo } from 'react'

import { ViewportContext } from './viewport'

import ItemShell from './itemshell'

/*
    TODO: check re-usability for set cradle content
*/

const Cradle = (props) => {

    // console.log('running cradle',props)
    const { gap, padding, runway, listsize, offset, orientation, cellHeight, cellWidth, getItem, placeholder } = props

    const state = useState('setup')

    const viewportData = useContext(ViewportContext)

    const itemobserver = useRef(null)

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

    //TODO: viewportData.viewportRect changes more often than needed here (with change of orientation).
    const viewportDimensions = useMemo(()=>{

        // console.log('calculate viewport dimensions',viewportData)
        let { viewportRect } = viewportData
        let { top, right, bottom, left } = viewportRect

        let viewportheight = bottom - top
        let viewportwidth = right - left
        return [viewportheight, viewportwidth]

    },[viewportData.viewportRect])

    let [viewportheight,viewportwidth] = viewportDimensions

    useEffect(()=> {

        let rootMargin
        if (orientation == 'horizontal') {
            rootMargin = `0px ${runway}px 0px ${runway}px`
        } else {
            rootMargin = `${runway}px 0px ${runway}px 0px`
        }
        // console.log('rootMargin',rootMargin)
        itemobserver.current = new IntersectionObserver((entries) => {
            // console.log('observing entries',entries)
        },{root:viewportData.elementref.current, rootMargin,} )

    },[orientation,runway])

    const crosscount = useMemo(() => {

        let crosscount
        let size = (orientation == 'horizontal')?viewportheight:viewportwidth
        let crossLength = (orientation == 'horizontal')?cellHeight:cellWidth

        let lengthforcalc = size - (padding * 2) + gap
        crosscount = Math.floor(lengthforcalc/(crossLength + gap))

        return crosscount

    },[orientation, padding, gap, cellWidth, cellHeight, viewportheight, viewportwidth])

    // fired when the configuration parameters of the cradle change
    useEffect(() => {
        // console.log('useEffect in cradle')
        // workaround to get FF to correctly size grid container for horizontal orientation
        // crosscount is ignored for vertical orientation

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
        crosscount,
      ]
    )

    // console.log('cradle scrollLeft, scrollTop, scrolling',scrollLeft, scrollTop, scrolling)

    const setCradleContent = useCallback(() => {

        // console.log('viewportData in cradle',viewportData)
        let localContentList = [] // any existing items will be re-used by react

        let {indexoffset, headindexcount, tailindexcount} = evaluateContentList()

        let childlistfragment = getContentList({
            orientation,
            indexoffset,
            headindexcount,
            tailindexcount,
            cellHeight,
            cellWidth,
            localContentList,
            observer:itemobserver.current
        })
        saveContentlist(childlistfragment)
        // console.log('childlistfragment',childlistfragment)
    },[
        orientation,
        viewportheight,
        viewportwidth,
        runway,
        cellHeight,
        cellWidth,
        // contentlist,
        gap,
        padding,
      ]
    )

    const evaluateContentList = useCallback(() => {
        let indexoffset = 0, headindexcount = 0, tailindexcount = 0
        let cradlelength, cellLength
        if (orientation == 'vertical') {
            cradlelength = (viewportheight + (padding * 2) - gap)
            cellLength = cellHeight + gap
        } else {
            cradlelength = (viewportwidth + (padding * 2) - gap)
            cellLength = cellWidth + gap
        }
        cradlelength += (runway * 2)
        let contentCount = Math.ceil(cradlelength/cellLength) * crosscount
        contentCount = Math.min(contentCount,listsize)
        headindexcount = contentCount

        // console.log('evalutateContentList',indexoffset,headindexcount,tailindexcount)

        return {indexoffset, headindexcount, tailindexcount}
    },[orientation, viewportheight, viewportwidth, runway, cellHeight, cellWidth, padding, gap])

    let divlinerstyles = divlinerstyleref.current

    // console.log('cradle width',divlinerstyles.width)
    // no result if styles not set
    return divlinerstyles.width
        ? <div 
            ref = {cradleElement} 
            style = {divlinerstyles}
          >
            {contentlist}
          </div>
        : null

} // Cradle


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

// adds itemshells at start of end of contentlist according to headindexcount and tailindescount,
// or if indexcount values are <0 removes them.
const getContentList = (props) => {
    let { 
        indexoffset, 
        headindexcount, 
        tailindexcount, 
        orientation, 
        cellHeight, 
        cellWidth, 
        localContentList:contentlist,
        observer,
    } = props
    let newContentlist = []

    if (headindexcount >= 0) {

        for (let index = indexoffset; index <(indexoffset + headindexcount); index++) {
            newContentlist.push(<ItemShell
                key = {index} 
                orientation = {orientation}
                text = { index + 1}
                cellHeight = { cellHeight }
                cellWidth = { cellWidth }
                index = {index}
                observer = {observer}
            />)
        }

    } else {

        contentlist = contentlist.splice(0,-headindexcount)

    }

    let returnContentlist = newContentlist.concat(contentlist)

    newContentlist = []

    if (tailindexcount >= 0) {

        for (let index = indexoffset; index <(indexoffset + tailindexcount); index++) {
            newContentlist.push(<ItemShell
                key = {index} 
                orientation = {orientation}
                text = { index + 1}
                cellHeight = { cellHeight }
                cellWidth = { cellWidth }
                index = {index}
                observer = {observer}
            />)
        }

    } else {

        contentlist = contentlist.splice(0,tailindexcount)

    }

    returnContentlist = returnContentlist.concat(newContentlist)

    return returnContentlist
}

export default Cradle