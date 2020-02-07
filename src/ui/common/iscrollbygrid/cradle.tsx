// cradle.tsx
// copyright (c) 2020 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React, { useState, useRef, useContext, useEffect } from 'react'

import { ScrollContext } from './viewport'

import ItemFrame from './itemframe'


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
        // justifyContent:'start',
        // alignContent:'start',
        boxSizing:'border-box',

    } as React.CSSProperties)

    let [oldOrientation, updateOrientation] = useState(null)

    let childlistref = useRef([])

    // console.log('cradle props, oldOrientation',props, oldOrientation)

    // if (newOrientation !== oldOrientation) {
    useEffect(() => {
        let positions = scrollData?{
            top:scrollData.viewportRect.top,
            right:scrollData.viewportRect.right,
            bottom:scrollData.viewportRect.bottom,
            left:scrollData.viewportRect.left,
        }:null
        updateCradleStyles(newOrientation, divlinerstyleref, cellCrossLength,positions)
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
        scrollData?.viewportRect.left
      ]
    )
    // }

    let divlinerstyles = divlinerstyleref.current

    // no result if styles not set
    return divlinerstyleref.current.width?<div style = {divlinerstyles}>{childlistref.current}</div>:null

} // Cradle

const updateCradleStyles = (newOrientation, stylesobject, cellCrossLength, positions) => {

        // console.log('Cradle updateCradleStyles',positions)
        if (!positions) return

        let length = positions.bottom - positions.top
        let width = positions.right - positions.left

        let styles = Object.assign({},stylesobject.current) as React.CSSProperties
        if (newOrientation == 'horizontal') {

            // workaround to get FF to correctly size grid container for horizontal orientation
            let crosscount = Math.floor(length/cellCrossLength) // TODO: refine for gap and padding

            styles.alignContent = 'start'
            styles.justifyContent = 'start'
            styles.width = 'auto'
            styles.height = '100%'
            styles.gridAutoFlow = 'column'
            styles.gridTemplateRows = cellCrossLength?`repeat(${crosscount}, minmax(${cellCrossLength}px, 1fr))`:'auto'
            styles.gridTemplateColumns = 'none'
        } else if (newOrientation == 'vertical') {
            styles.alignContent = 'normal'
            styles.justifyContent = 'start'
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