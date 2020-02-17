// cradle.tsx
// copyright (c) 2020 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React, { useState, useRef, useContext, useEffect, useLayoutEffect, useCallback, useMemo } from 'react'

import { ViewportContext } from './viewport'

import ItemShell from './itemshell'

/*
    TODO: check re-usability for set cradle content
    memoize output to minimize render
*/

const Cradle = (props) => {

    // console.log('running cradle',props)
    const { gap, padding, runway, listsize, offset, orientation, cellHeight, cellWidth, getItem, placeholder } = props

    const state = useRef('setup')

    const viewportData = useContext(ViewportContext)

    const itemobserver = useRef(null)

    const [contentlist,saveContentlist] = useState([])

    const [dropentries, saveDropentries] = useState(null)

    const [addentries, saveAddentries] = useState(null)

    const divlinerstyleref = useRef({
        position: 'absolute',
        backgroundColor: 'blue',
        display: 'grid',
        gridGap: gap + 'px',
        padding: padding + 'px',
        justifyContent:'start',
        alignContent:'start',
        boxSizing:'border-box',

    } as React.CSSProperties)

    const cradleElementRef = useRef(null)
    // console.log('cradleElementRef',cradleElementRef)

    const viewportDimensions = useMemo(()=>{

        // console.log('calculate viewport dimensions',viewportData)
        let { viewportRect } = viewportData
        let { top, right, bottom, left } = viewportRect

        let viewportheight = bottom - top
        let viewportwidth = right - left
        return [viewportheight, viewportwidth]

    },[viewportData.viewportRect])

    let [viewportheight,viewportwidth] = viewportDimensions

    useEffect(()=>{
        // console.log('setting state to setup')
        state.current = 'setup'
    },[orientation])

    useEffect(()=> {

        let rootMargin
        if (orientation == 'horizontal') {
            rootMargin = `0px ${runway}px 0px ${runway}px`
        } else {
            rootMargin = `${runway}px 0px ${runway}px 0px`
        }
        // console.log('rootMargin',rootMargin)
        itemobserver.current = new IntersectionObserver(
            itemobservercallback,
            {root:viewportData.elementref.current, rootMargin,} 
        )

    },[orientation,runway])

    const itemobservercallback = useCallback((entries)=>{
        // console.log('state, entries',state,entries)
        if (state.current == 'setup') {
            // console.log('cradle setup itemcallback entries',state, entries)
            state.current = 'run'
        } else {
            let dropentries = entries.filter(entry => (!entry.isIntersecting))

            if (dropentries.length) {
                // console.log('itemobservercallback',dropentries)
                saveDropentries(dropentries)
            }
        }
    },[])

    // drop scroll content
    useEffect(()=>{
        if (dropentries === null) return

        let sampleEntry = dropentries[0]

        let cradleElement = cradleElementRef.current
        let parentElement = cradleElement.parentElement
        let viewportElement = viewportData.elementref.current
        // console.log('dropentries updated:dropentries, contentlist',dropentries,contentlist)
        let tailpos
        let headpos
        let styles = {...divlinerstyleref.current}
        let scrollforward
        let localContentList
        if (orientation == 'vertical') {
            // scrollamount = viewportElement.scrollTop
        } else {
            scrollforward = (sampleEntry.boundingClientRect.x - sampleEntry.rootBounds.x < 0)//dropped cell is to the left
            let offsetLeft = cradleElement.offsetLeft
            let offsetWidth = cradleElement.offsetWidth
            let parentWidth = parentElement.offsetWidth
            if (scrollforward) {

                tailpos = offsetLeft + offsetWidth
                styles.left = 'auto'
                styles.right = (parentWidth - tailpos) + 'px'
                localContentList = getContentList({localContentList:contentlist,headindexcount:-dropentries.length,tailindexcount:0})

            } else {
                headpos = offsetLeft
                styles.left = headpos + 'px'
                styles.right = 'auto'
                localContentList = getContentList({localContentList:contentlist,headindexcount:0,tailindexcount:-dropentries.length})
            }
        }

        // console.log('dropentries styles',styles)

        divlinerstyleref.current = {...styles}

        saveContentlist(localContentList)
        saveDropentries(null)
        saveAddentries({count:dropentries.length,scrollforward})
    },[dropentries])

    // add scroll content
    useEffect(()=>{
        if (addentries === null) return
        // console.log('cradleElementRef in add scroll content',cradleElementRef)
        let cradleElement = cradleElementRef.current
        let parentElement = cradleElement.parentElement
        let viewportElement = viewportData.elementref.current
        // console.log('addentries updated:addentries, contentlist',addentries,contentlist)
        let tailpos
        let headpos
        let styles = {...divlinerstyleref.current}
        let { scrollforward } = addentries
        let localContentList
        if (orientation == 'vertical') {
        } else {
            let offsetLeft = cradleElement.offsetLeft
            let offsetWidth = cradleElement.offsetWidth
            let parentWidth = parentElement.offsetWidth
            if (scrollforward) {
                headpos = offsetLeft
                styles.right = 'auto'
                styles.left = headpos + 'px'

                localContentList = getContentList({
                    localContentList:contentlist,
                    headindexcount:0,
                    tailindexcount:addentries.count,
                    indexoffset:contentlist[0].props.index,
                    orientation,
                    cellHeight,
                    cellWidth,
                    observer:itemobserver.current,
                })

            } else {
                tailpos = offsetLeft + offsetWidth
                styles.left = 'auto'
                styles.right = (parentWidth - tailpos) + 'px'

                localContentList = getContentList({
                    localContentList:contentlist,
                    headindexcount:addentries.count,
                    tailindexcount:0,
                    indexoffset:contentlist[0].props.index,
                    orientation,
                    cellHeight,
                    cellWidth,
                    observer:itemobserver.current,
                })

            }
        }

        // console.log('addentries addentries, headpos, tailpos, contentlist',addentries, headpos, tailpos, localContentList)
        // console.log('addentries styles',styles)

        divlinerstyleref.current = {...styles}
        saveContentlist(localContentList)
        saveAddentries(null)

    },[addentries])

    const crosscount = useMemo(() => {

        let crosscount
        let size = (orientation == 'horizontal')?viewportheight:viewportwidth
        let crossLength = (orientation == 'horizontal')?cellHeight:cellWidth

        let lengthforcalc = size - (padding * 2) + gap
        crosscount = Math.floor(lengthforcalc/(crossLength + gap))

        return crosscount

    },[orientation, padding, gap, cellWidth, cellHeight, viewportheight, viewportwidth])

    // fired when the configuration parameters of the cradle change
    useEffect(() => {
        // console.log('useEffect in cradle')
        // workaround to get FF to correctly size grid container for horizontal orientation
        // crosscount is ignored for vertical orientation

        setCradleStyles(orientation, divlinerstyleref, cellHeight, cellWidth, crosscount, viewportheight, viewportwidth)
        setCradleContent()

    },[
        orientation,
        cellHeight,
        cellWidth,
        gap,
        padding,
        viewportheight,
        viewportwidth,
        crosscount,
      ]
    )

    const setCradleContent = useCallback(() => {

        let localContentList = [] // any existing items will be re-used by react

        let {indexoffset, headindexcount, tailindexcount} = evaluateContentList()

        let childlistfragment = getContentList({
            orientation,
            indexoffset,
            headindexcount,
            tailindexcount,
            cellHeight,
            cellWidth,
            localContentList,
            observer:itemobserver.current
        })
        saveContentlist(childlistfragment)

    },[
        orientation,
        viewportheight,
        viewportwidth,
        runway,
        cellHeight,
        cellWidth,
        gap,
        padding,
      ]
    )

    const evaluateContentList = useCallback(() => {
        let indexoffset = 0, headindexcount = 0, tailindexcount = 0
        let cradlelength, cellLength
        if (orientation == 'vertical') {
            cradlelength = (viewportheight + (padding * 2) - gap)
            cellLength = cellHeight + gap
        } else {
            cradlelength = (viewportwidth + (padding * 2) - gap)
            cellLength = cellWidth + gap
        }
        cradlelength += (runway * 2)
        let contentCount = Math.ceil(cradlelength/cellLength) * crosscount
        contentCount = Math.min(contentCount,listsize)
        tailindexcount = contentCount

        return {indexoffset, headindexcount, tailindexcount}
    },[orientation, viewportheight, viewportwidth, runway, cellHeight, cellWidth, padding, gap])

    let divlinerstyles = divlinerstyleref.current
    // console.log('divlinerstyles',divlinerstyles)

    // no result if styles not set
    return divlinerstyles.width
        ? <div 
            ref = {cradleElementRef} 
            style = {divlinerstyles}
          >
            {contentlist}
          </div>
        : null

} // Cradle


const setCradleStyles = (orientation, stylesobject, cellHeight, cellWidth, crosscount,viewportheight, viewportwidth) => {

        let styles = Object.assign({},stylesobject.current) as React.CSSProperties
        if (orientation == 'horizontal') {
            styles.width = 'auto'
            styles.height = '100%'
            styles.gridAutoFlow = 'column'
            // explict crosscount next line as workaround for FF problem - 
            //     sets length of horiz cradle items in one line (row), not multi-row config
            styles.gridTemplateRows = cellHeight?`repeat(${crosscount}, minmax(${cellHeight}px, 1fr))`:'auto'
            styles.gridTemplateColumns = 'none'
            styles.minWidth = viewportwidth + 'px'
            styles.minHeight = 0
        } else if (orientation == 'vertical') {
            styles.width = '100%'
            styles.height = 'auto'
            styles.gridAutoFlow = 'row'
            styles.gridTemplateRows = 'none'
            styles.gridTemplateColumns = cellWidth?`repeat(auto-fit, minmax(${cellWidth}px, 1fr))`:'auto'
            styles.minWidth = 0
            styles.minHeight = viewportheight + 'px'
        }

        stylesobject.current = styles
}

// adds itemshells at start of end of contentlist according to headindexcount and tailindescount,
// or if indexcount values are <0 removes them.
const getContentList = (props) => {
    // console.log('getContentList props',props)
    let { 
        indexoffset, 
        headindexcount, 
        tailindexcount, 
        orientation, 
        cellHeight, 
        cellWidth, 
        localContentList:contentlist,
        observer,
    } = props

    let localContentlist = [...contentlist]
    let tailindexoffset = indexoffset + contentlist.length
    let returnContentlist
    let headContentlist = []
    if (headindexcount >= 0) {

        // console.log('adding head items',indexoffset,headindexcount)
        for (let index = indexoffset - headindexcount; index < (indexoffset); index++) {
            headContentlist.push(<ItemShell
                key = {index} 
                orientation = {orientation}
                text = { index + 1}
                cellHeight = { cellHeight }
                cellWidth = { cellWidth }
                index = {index}
                observer = {observer}
            />)
        }

    } else {

        localContentlist.splice(0,-headindexcount)

    }

    let tailContentlist = []
    if (tailindexcount >= 0) {

        for (let index = tailindexoffset; index <(tailindexoffset + tailindexcount); index++) {
            tailContentlist.push(<ItemShell
                key = {index} 
                orientation = {orientation}
                text = { index + 1}
                cellHeight = { cellHeight }
                cellWidth = { cellWidth }
                index = {index}
                observer = {observer}
            />)
        }

    } else {
        // console.log('removing tail items',localContentlist,tailindexcount)
        localContentlist.splice(tailindexcount,-tailindexcount)
        // console.log('the three parts',headContentlist,localContentlist,tailContentlist)
    }

    returnContentlist = headContentlist.concat(localContentlist,tailContentlist)

    return returnContentlist
}

export default Cradle