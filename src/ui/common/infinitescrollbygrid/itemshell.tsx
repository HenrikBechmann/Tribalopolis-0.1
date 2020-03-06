// itemframe.tsx
// copyright (c) 2020 Henrik Bechmann, Toronto, Licence: MIT

import React, {useRef, useEffect, useState, useCallback } from 'react'

const ItemShell = (props) => {
    // console.log('itemshell props',{...props})
    const {text, orientation, cellHeight, cellWidth, index, observer, callbacks, getItem} = props
    // console.log('item props',index, props)
    const [content, saveContent] = useState(null)
    const shellRef = useRef(null)
    const [styles,saveStyles] = useState({
        boxSizing:'border-box',
        backgroundColor:'cyan',
        border:'2px solid black',
        overflow:'hidden',
    } as React.CSSProperties)

    useEffect(() => {
        let itemrequest = {current:null}
        if (getItem) {
            itemrequest = window['requestIdleCallback'](()=> {

                // console.log('idleCallback for index',index)

                let value = getItem(index)
                if (value.then) {
                    value.then((value) => {
                        saveContent(value)
                    })
                } else {
                    saveContent(value)
                }
            })
        }
        return () => {
            window['cancelIdleCallback'](itemrequest.current)
        }
    },[])

    // initialize
    useEffect(() => {

        let localcalls = callbacks.current
        // console.log('calling register itemshell: index, callbacks',index, localcalls)
        localcalls.getElementData && localcalls.getElementData(getElementData(),'register')
        return (()=>{

            // console.log('calling unregister itemshell',index, localcalls)
            localcalls.getElementData && localcalls.getElementData(getElementData(),'unregister')

        })

    },[callbacks])

    useEffect(()=>{

        observer.observe(shellRef.current)

        return () => {
            observer.unobserve(shellRef.current)
        }

    },[observer])

    useEffect(()=>{

        saveContent(text)

    },[text])

    useEffect(()=>{

        let newStyles = getShellStyles(orientation, cellHeight, cellWidth, styles)
        saveStyles(newStyles)

    },[orientation,cellHeight,cellWidth])

    const getElementData = useCallback(()=>{
        return [index, shellRef]
    },[])

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
