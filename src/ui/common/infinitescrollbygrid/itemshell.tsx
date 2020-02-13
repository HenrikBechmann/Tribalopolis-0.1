// itemframe.tsx
// copyright (c) 2020 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React, {useRef, useCallback } from 'react'

const ItemShell = (props) => {
    const {text, orientation, cellHeight, cellWidth, index} = props
    const shellRef = useRef(null)
    const styles = useRef({ 
        boxSizing:'border-box',
        backgroundColor:'cyan',
        border:'2px solid black',
        height:cellHeight?(cellHeight + 'px'):'auto',
        width:'auto',
    } as React.CSSProperties)

    const setStyles = useCallback(()=>{

        updateShellStyles(orientation, cellHeight, cellWidth, styles)

    },[orientation])

    setStyles()

    // console.log('itemshell index',index)

    return <div ref = { shellRef } data-index = {index} style = {styles.current}>{text}</div>

}

const updateShellStyles = (orientation, cellHeight, cellWidth, oldstyles) => {

    // console.log('inside updateStyles: oldOrientation, newOrientation, oldstyles',oldOrientation, newOrientation, oldstyles)

    let styleset:React.CSSProperties = Object.assign({},oldstyles.current)

    if (orientation == 'horizontal') {
        styleset.width = cellWidth?(cellWidth + 'px'):'auto'
        styleset.height = 'auto'
    } else if (orientation === 'vertical') {
        styleset.width = 'auto'
        styleset.height = cellHeight?(cellHeight + 'px'):'auto'
    }

    // console.log('updated ItemFrame styleset',styleset)

    oldstyles.current = styleset
    // setOrientation(newOrientation)
    // console.log('new styleset',styleset, oldstyles)
}

export default ItemShell
