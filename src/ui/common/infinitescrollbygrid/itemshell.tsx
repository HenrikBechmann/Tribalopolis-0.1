// itemframe.tsx
// copyright (c) 2020 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React, {useRef, useEffect, useState } from 'react'

const ItemShell = (props) => {
    const {text, orientation, cellHeight, cellWidth, index} = props
    const [content, saveContent] = useState({value:null})
    const shellRef = useRef(null)
    const styles = useRef({ 
        boxSizing:'border-box',
        backgroundColor:'cyan',
        border:'2px solid black',
    } as React.CSSProperties)

    useEffect(()=>{

        // console.log('item layouteffect')
        updateShellStyles(orientation, cellHeight, cellWidth, styles)
        saveContent({value:text})

    },[orientation,text,cellHeight,cellWidth,styles])

    let stylecopy = Object.assign({},styles.current)

    // console.log('using styles for itemshell',index,stylecopy)

    return <div ref = { shellRef } data-index = {index} style = {styles.current}>
        {styles.current.width?content.value:null}
    </div>

} // ItemShell

const updateShellStyles = (orientation, cellHeight, cellWidth, styles) => {

    let styleset:React.CSSProperties = Object.assign({},styles.current)

    if (orientation == 'horizontal') {
        styleset.width = cellWidth?(cellWidth + 'px'):'auto'
        styleset.height = 'auto'
    } else if (orientation === 'vertical') {
        styleset.width = 'auto'
        styleset.height = cellHeight?(cellHeight + 'px'):'auto'
    }

    // console.log('updated ItemFrame styleset',styleset)
    // console.log('inside item updateStyles: orientation, styles.current, styleset',
    //     orientation, cellWidth, cellHeight, Object.assign({},styles.current, styleset))

    styles.current = styleset

}

export default ItemShell
