// placeholder.tsx
// copyright (c) 2020 Henrik Bechmann, Toronto, Licence: MIT

import React, {useRef, useEffect, useState, useCallback } from 'react'

const Placeholder = (props) => {

    // console.log('running Placeholder',props)

    const stylesRef = useRef({
        position:'relative',
        boxSizing:'border-box',
        backgroundColor:'cyan',
        border:'2px solid black',
        height:'100%',
        width:'100%'
    } as React.CSSProperties)
    const itemStylesRef = useRef(
        {
            position:'absolute',
            top:0,
            left:0,
            padding:'3px',
            opacity:.5,
            borderRadius:'8px',
            backgroundColor:'white', 
            margin:'3px',
            fontSize:'smaller',
        } as React.CSSProperties
    )

    let { index, listsize } = props

    return <div style = {stylesRef.current}>
        <div style = {itemStylesRef.current}>{props.index + 1}/{props.listsize}</div>
        
    </div>
}

export default Placeholder