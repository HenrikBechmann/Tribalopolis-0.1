// itemframe.tsx
// copyright (c) 2020 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React, {useState, useRef, useEffect, useContext} from 'react'

const ItemFrame = (props) => {
    let {text, orientation:newOrientation, cellLength} = props
    let styles = useRef({ // use useRef() instead
        boxSizing:'border-box',
        backgroundColor:'cyan',
        border:'2px solid black',
        // default vertical
        height:cellLength,
        width:'auto',
    } as React.CSSProperties)

    let [oldOrientation, setOrientation] = useState('vertical')

    // console.log('ItemFrame text, old and new orientations', text, oldOrientation, newOrientation)

    // sets newDorection if different, as side effect
    if (oldOrientation !== newOrientation) {
    
        updateFrameStyles(newOrientation, cellLength, styles)

        setOrientation(newOrientation)
    }

    // console.log('RUNNING styles',styles)

    return <div style = {styles.current}>{text}</div>
}

const updateFrameStyles = (newOrientation, cellLength, oldstyles) => {

    // console.log('inside updateStyles: oldOrientation, newOrientation, oldstyles',oldOrientation, newOrientation, oldstyles)

    let styleset:React.CSSProperties = Object.assign({},oldstyles.current)

    if (newOrientation == 'horizontal') {
        styleset.width = cellLength + 'px'
        styleset.height = 'auto'
    } else if (newOrientation === 'vertical') {
        styleset.height = cellLength + 'px'
        styleset.width = 'auto'
    }

    // console.log('updated ItemFrame styleset',styleset)

    oldstyles.current = styleset
    // setOrientation(newOrientation)
    // console.log('new styleset',styleset, oldstyles)
}

export default ItemFrame
