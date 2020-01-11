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
        gridTemplateColumns: cellCrossLength?`repeat(auto-fill, minmax(${cellCrossLength}, 1fr))`:'auto',
        gridGap: gap + 'px',
        padding: padding + 'px',
        justifyContent:'start',
        alignContent:'start',

    } as React.CSSProperties)

    let [oldOrientation, updateOrientation] = useState(null)

    let childlistref = useRef([])

    // console.log('cradle props',props, oldOrientation)

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

const updateCradleStyles = (newOrientation, oldStyles, cellCrossLength) => {

        let styles = Object.assign({},oldStyles.current) as React.CSSProperties
        if (newOrientation == 'horizontal') {
            styles.left = 0
            styles.right = 'auto'
            styles.top = 0
            styles.bottom = 0
            styles.gridAutoFlow = 'column'
            styles.gridTemplateRows = cellCrossLength?`repeat(auto-fill, minmax(${cellCrossLength}px, 1fr))`:'auto'
            styles.gridTemplateColumns = 'none'
        } else if (newOrientation == 'vertical') {
            styles.left = 0
            styles.right = 0
            styles.top = 0
            styles.bottom = 'auto'
            styles.gridAutoFlow = 'row'
            styles.gridTemplateRows = 'none'
            styles.gridTemplateColumns = cellCrossLength?`repeat(auto-fill, minmax(${cellCrossLength}px, 1fr))`:'auto'
        }
        oldStyles.current = styles
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