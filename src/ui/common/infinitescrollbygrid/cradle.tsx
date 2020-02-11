// cradle.tsx
// copyright (c) 2020 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React, { useState, useRef, useContext, useEffect, useLayoutEffect } from 'react'

import { ViewportContext } from './viewport'

import ItemFrame from './itemframe'

const Cradle = (props) => {
    let { gap, padding, runway, listsize, offset, orientation, cellHeight, cellWidth, getItem, placeholder } = props

    let viewportData = useContext(ViewportContext)

    let [childlist,saveChildlist] = useState([])

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

    let cradleElement = useRef(null)

    // fired when the configuration parameters of the cradle change
    useEffect(() => {
        let viewportRect = viewportData?.viewportRect
        let positions = viewportRect?{
            top:viewportRect.top,
            right:viewportRect.right,
            bottom:viewportRect.bottom,
            left:viewportRect.left,
        }:null

        // console.log('cradle useEffect positions',positions)

        if (positions) {

            let viewportlength = positions.bottom - positions.top
            let viewportwidth = positions.right - positions.left

            // workaround to get FF to correctly size grid container for horizontal orientation
            // crosscount is ignored for vertical orientation
            let crosscount = getCrosscount(orientation,padding,gap,cellWidth,cellHeight,viewportlength, viewportwidth)

            updateCradleStyles(orientation, divlinerstyleref, cellHeight, cellWidth, crosscount)
            updateChildList()

        }
    },[
        orientation,
        gap,
        padding,
        viewportData,
      ]
    )

    // console.log('cradle scrollLeft, scrollTop, scrolling',scrollLeft, scrollTop, scrolling)

    const updateChildList = () => {

        if (!viewportData) return

        let newChildList = [...childlist]

        // console.log('updateChildList',viewportData, cradleElement) //, newChildList)

        let {indexoffset, indexcount} = evaluateChildList(orientation, viewportData, cradleElement)

        let childlistfragment = getContentList({
            orientation,
            indexoffset,
            indexcount,
            cellHeight,
            cellWidth,
        })
        saveChildlist(childlistfragment)
        // console.log('childlistfragment',childlistfragment)
    }

    const evaluateChildList = (orientation, viewportData,cradleElement) => {
        let indexoffset = 0, indexcount = 100

        return {indexoffset, indexcount}
    }

    let divlinerstyles = divlinerstyleref.current

    // no result if styles not set
    return viewportData?<div ref = {cradleElement} style = {divlinerstyles}>{childlist}</div>:null

} // Cradle


const getCrosscount = (orientation, padding, gap, cellWidth, cellHeight, viewportlength, viewportwidth) => {

    let crosscount
    let size = (orientation == 'horizontal')?viewportlength:viewportwidth
    let crossLength = (orientation == 'horizontal')?cellHeight:cellWidth

    let lengthforcalc = size - (padding * 2) + gap
    crosscount = Math.floor(lengthforcalc/(crossLength + gap))

    return crosscount

}

const updateCradleStyles = (orientation, stylesobject, cellHeight, cellWidth, crosscount) => {

        // console.log('Cradle updateCradleStyles',positions)

        let styles = Object.assign({},stylesobject.current) as React.CSSProperties
        if (orientation == 'horizontal') {
            styles.width = 'auto'
            styles.height = '100%'
            styles.gridAutoFlow = 'column'
            // explict crosscount next line as workaround for FF problem - 
            //     sets length of horiz cradle items in one line (row), not multi-row config
            styles.gridTemplateRows = cellHeight?`repeat(${crosscount}, minmax(${cellHeight}px, 1fr))`:'auto'
            styles.gridTemplateColumns = 'none'
        } else if (orientation == 'vertical') {
            styles.width = '100%'
            styles.height = 'auto'
            styles.gridAutoFlow = 'row'
            styles.gridTemplateRows = 'none'
            styles.gridTemplateColumns = cellWidth?`repeat(auto-fit, minmax(${cellWidth}px, 1fr))`:'auto'
        }
        // console.log('updated style', styles)
        stylesobject.current = styles
}

const getContentList = (props) => {
    let { indexoffset, indexcount, orientation, cellHeight, cellWidth } = props
    let contentlist = []
    indexcount = 10
    for (let index = indexoffset + 1; index <(indexoffset + indexcount + 1); index++) {
        contentlist.push(<ItemFrame 
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