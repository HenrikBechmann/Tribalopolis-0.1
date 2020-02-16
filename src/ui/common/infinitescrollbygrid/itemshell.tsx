// itemframe.tsx
// copyright (c) 2020 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React, {useRef, useEffect, useState } from 'react'

const ItemShell = (props) => {
    const {text, orientation, cellHeight, cellWidth, index, observer} = props
    const [content, saveContent] = useState(null)
    const shellRef = useRef(null)
    const [styles,saveStyles] = useState({ 
        boxSizing:'border-box',
        backgroundColor:'cyan',
        border:'2px solid black',
    } as React.CSSProperties)

    useEffect(()=>{

        observer.observe(shellRef.current)
        
        return () => {
            observer.unobserve(shellRef.current)
        }

    },[])

    useEffect(()=>{

        saveContent(text)

    },[text])

    useEffect(()=>{

        let newStyles = getShellStyles(orientation, cellHeight, cellWidth, styles)
        saveStyles(newStyles)

    },[orientation,cellHeight,cellWidth])

    return <div ref = { shellRef } data-index = {index} style = {styles}>
        {styles.width?content:null}
    </div>

} // ItemShell

const getShellStyles = (orientation, cellHeight, cellWidth, styles) => {

    let styleset = Object.assign({},styles)
    if (orientation == 'horizontal') {
        styleset.width = cellWidth?(cellWidth + 'px'):'auto'
        styleset.height = 'auto'
    } else if (orientation === 'vertical') {
        styleset.width = 'auto'
        styleset.height = cellHeight?(cellHeight + 'px'):'auto'
    }

    return styleset

}

export default ItemShell
