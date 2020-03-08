// itemframe.tsx
// copyright (c) 2020 Henrik Bechmann, Toronto, Licence: MIT

import React, {useRef, useEffect, useState, useCallback } from 'react'

import {requestIdleCallback, cancelIdleCallback} from 'requestidlecallback'

import Placeholder from './placeholder'

const ItemShell = (props) => {
    const {orientation, cellHeight, cellWidth, index, observer, callbacks, getItem, listsize, placeholder} = props
    
    // console.log('item index, placeholder',index, placeholder)
    
    const [content, saveContent] = useState(null)
    const shellRef = useRef(null)
    const [styles,saveStyles] = useState({
        overflow:'hidden',
    } as React.CSSProperties)

    useEffect(() => {
        let itemrequest = {current:null}
        let requestidlecallback = window['requestIdleCallback']?window['requestIdleCallback']:requestIdleCallback
        let cancelidlecallback = window['cancelIdleCallback']?window['cancelIdleCallback']:cancelIdleCallback
        if (getItem) {
            itemrequest = requestidlecallback(()=> {

                let value = getItem(index)
                if (value && value.then) {
                    value.then((value) => {
                        saveContent(value)
                    }).catch(() => {
                        saveContent('unavailable')
                    })
                } else {
                    saveContent(value)
                }
            })
        }

        return () => {
            let requesthandle = itemrequest.current
            cancelidlecallback(requesthandle)
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

        let newStyles = getShellStyles(orientation, cellHeight, cellWidth, styles)
        saveStyles(newStyles)

    },[orientation,cellHeight,cellWidth])

    const getElementData = useCallback(()=>{
        return [index, shellRef]
    },[])

    const customholderRef = useRef(placeholder?React.createElement(placeholder, {index, listsize}):null)

    return <div ref = { shellRef } data-index = {index} style = {styles}>
        {styles.width?
            content?
                content:customholderRef.current?
                    customholderRef.current:<Placeholder index = {index} listsize = {listsize}/>
        :null}
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
