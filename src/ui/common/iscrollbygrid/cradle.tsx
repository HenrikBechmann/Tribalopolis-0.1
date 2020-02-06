// cradle.tsx
// copyright (c) 2020 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React, { useState, useRef } from 'react'

import ItemFrame from './itemframe'


const Cradle = (props) => {
    let { gap, padding, runway, listsize, offset, orientation:newOrientation, cellLength, cellCrossLength, getItem, placeholder } = props

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

    console.log('cradle props, oldOrientation',props, oldOrientation)

    if (newOrientation !== oldOrientation) {
        updateCradleStyles(newOrientation, divlinerstyleref, cellCrossLength)
        childlistref.current = getContent({
            orientation:newOrientation,
            contentdata:['item 1','item 2','item 3','item 4','item 5',],
            cellLength,
        })
        updateOrientation(newOrientation)
    }

    let divlinerstyles = divlinerstyleref.current

    return <div style = {divlinerstyles}>{childlistref.current}</div>

} // Cradle

const updateCradleStyles = (newOrientation, stylesobject, cellCrossLength) => {

        let styles = Object.assign({},stylesobject.current) as React.CSSProperties
        if (newOrientation == 'horizontal') {
            styles.alignContent = 'start'
            styles.justifyContent = 'start'
            styles.width = 'auto'
            styles.height = '100%'
            styles.gridAutoFlow = 'column'
            styles.gridTemplateRows = cellCrossLength?`repeat(2, minmax(${cellCrossLength}px, 1fr))`:'auto'
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
        console.log('updated style', styles)
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