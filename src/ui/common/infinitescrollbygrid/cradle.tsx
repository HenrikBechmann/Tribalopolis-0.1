// cradle.tsx
// copyright (c) 2020 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React, { useState, useRef, useContext, useEffect, useLayoutEffect, useCallback, useMemo } from 'react'

import { ViewportContext } from './viewport'

import ItemShell from './itemshell'

/*
    - observer should be restrained regarding number of contentlist additions by the listsize parameter (but zero based)

    - review state flow and structure
    - correct infinite loop in horizontal view arising from resize
    - focus on static switch from horizontal to vertical
    - dynamic switch of orientation
    - limit rendering to 0 and above, and below listsize
    - edge case: scrolling left from parially filled column would only generate partial replacement
        needs to be adjusted for crosscount
    - vertical scrolling
    - memoize output to minimize render
    - integrate contentOffsetForActionRef in all contentlist creation
*/


const Cradle = (props) => {

    // console.log('running cradle',props)
    const { gap, padding, runway, listsize, offset, orientation, cellHeight, cellWidth, getItem } = props

    // const iterationsRef = useRef(0)

    const [processingstate, saveProcessingstate] = useState('setup')
    const processingstateRef = useRef(null) // for observer call closure
    processingstateRef.current = processingstate // most recent value
    console.log('---------------------------')
    console.log('CALLING CRADLE with state',processingstate)

    const viewportData = useContext(ViewportContext)

    const itemobserver = useRef(null)

    const [contentlist,saveContentlist] = useState([])

    const [dropentries, saveDropentries] = useState(null)

    const [addentries, saveAddentries] = useState(null)

    const divlinerStylesRef = useRef({
        position: 'absolute',
        backgroundColor: 'blue',
        display: 'grid',
        gridGap: gap + 'px',
        padding: padding + 'px',
        justifyContent:'start',
        alignContent:'start',
        boxSizing:'border-box',

    } as React.CSSProperties)

    const divlinerStyleRevisionsRef = useRef(null) // for modifications by observer actions **NEW**

    const contentOffsetForActionRef = useRef(offset || 0) // used for contentList creation; used for orientation change, and resize

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

    const crosscount = useMemo(() => {

        let crosscount
        let size = (orientation == 'horizontal')?viewportheight:viewportwidth
        let crossLength = (orientation == 'horizontal')?cellHeight:cellWidth

        let lengthforcalc = size - (padding * 2) + gap
        crosscount = Math.floor(lengthforcalc/(crossLength + gap))

        return crosscount

    },[
        orientation, 
        cellWidth, 
        cellHeight, 
        gap, 
        padding, 
        viewportheight, 
        viewportwidth,
    ])

    const crosscountRef = useRef(crosscount) // for easy reference by observer **NEW**

    divlinerStylesRef.current = useMemo(()=> {

        let divlinerStyles:React.CSSProperties = Object.assign({...divlinerStylesRef.current},divlinerStyleRevisionsRef.current)
        let styles = setCradleStyles(
            orientation, 
            divlinerStyles, 
            cellHeight, 
            cellWidth, 
            gap,
            crosscount, 
            viewportheight, 
            viewportwidth)

        console.log('setting cradle styles',{...styles})

        return {...styles} //setDivlinerstyles(styles)
    },[
        orientation,
        cellHeight,
        cellWidth,
        gap,
        padding,
        viewportheight,
        viewportwidth,
        crosscount,
        divlinerStyleRevisionsRef.current
      ])

    // processing states = setup, reset, update, scroll (was run)
    useEffect(()=> {
        console.log('state transformation from',processingstate)
        switch (processingstate) {
            case 'reset':
                console.log('setting processingstate from reset to setup',)
                saveProcessingstate('setup')
                break
            case 'setup': 
                console.log('setting processingstate from setup to initobserver',)
                saveProcessingstate('initobserver')
                break
            // case 'initobserver': 
            //     console.log('setting processingstate from setup to initobserver',)
            //     saveProcessingstate('scroll')
            //     break
            case 'update':
                console.log('setting processingstate from update to scroll',)
                saveProcessingstate('scroll')
                break
            case 'scroll':
                // do nothing
                break
        }
    },[processingstate])  

    // respond to change in orientation
    useEffect(()=> {

        console.log('initializing system with processingstate',processingstate)
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
        saveContentlist([])
        if (processingstate != 'setup') {
            console.log('setting processingstate from setup to reset',)            
            saveProcessingstate('reset')
        }

    },[orientation])

    // -------------------------[ IntersectionObserver support]-------------------------

    // "head" is right for scrollforward; left for not scrollforward (scroll backward)
    // "tail" is left for scrollforward; right for not scrollforward (scroll backward)

    const itemobservercallback = useCallback((entries)=>{
        // iterationsRef.current++
        // if (iterationsRef.current >= 10) {
        //     console.log('------------------')
        //     console.log('observer iterations have reached 10')
        //     return
        // }
        console.log('itemobservercallback state, entries',processingstateRef.current)
        // let dropentries = entries.filter(entry => (!entry.isIntersecting))
        if (processingstateRef.current == 'scroll') { // first pass is after setBaseContent, no action required
            let dropentries = entries.filter(entry => (!entry.isIntersecting))
            console.log('processing scroll items to drop', dropentries.length)

            if (dropentries.length) {
                // console.log('itemobservercallback',dropentries)
                saveDropentries(dropentries)

            }
        }
        if (processingstateRef.current == 'initobserver') {
            console.log('setting processingstate from initobserver to scroll',)            
            saveProcessingstate('scroll')
        }
    },[])

    // drop scroll content
    useEffect(()=>{
        if (dropentries === null) return

        console.log('processing dropentries',dropentries)
        let sampleEntry = dropentries[0]

        let cradleElement = cradleElementRef.current
        let parentElement = cradleElement.parentElement
        let viewportElement = viewportData.elementref.current
        // console.log('dropentries updated:dropentries, contentlist',dropentries,contentlist)
        let tailpos
        let headpos
        let styles = {} as React.CSSProperties // {...divlinerStylesRef.current}
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

        console.log('dropentries styles',{...styles}, localContentList, scrollforward)

        divlinerStyleRevisionsRef.current = { ...styles }

        saveContentlist(localContentList) // delete entries
        saveDropentries(null)
        saveAddentries({count:Math.ceil(dropentries.length/crosscountRef.current)*crosscountRef.current,scrollforward})
        console.log('end of drop entries')
    },[dropentries])

    // add scroll content
    useEffect(()=>{
        if (addentries === null) return
        console.log('processing addentries',addentries)
        // console.log('cradleElementRef in add scroll content',cradleElementRef)
        let cradleElement = cradleElementRef.current
        let parentElement = cradleElement.parentElement
        let viewportElement = viewportData.elementref.current
        // console.log('addentries updated:addentries, contentlist',addentries,contentlist)
        let tailpos
        let headpos
        let styles = {} as React.CSSProperties
        // let styles = {...divlinerStylesRef.current}
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
        console.log('addentries headpos, styles, localContentList',headpos,{...styles}, localContentList)

        divlinerStyleRevisionsRef.current = {...styles}
        saveContentlist(localContentList)
        saveAddentries(null)
        console.log('end of processing addentries')
    },[addentries])

    // -------------------------[ End of IntersectionObserver support]-------------------------

    useEffect(() => {
        console.log('processingstate for setup setcradlecontent',processingstate)
        if (processingstate != 'setup') return
        // workaround to get FF to correctly size grid container for horizontal orientation
        // crosscount is ignored for vertical orientation
        setCradleContent()

    },[
        // state.current
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

        let {indexoffset, headindexcount, tailindexcount} = 
            evaluateContentList(
                cellHeight, 
                cellWidth, 
                orientation, 
                viewportheight, 
                viewportwidth, 
                runway, 
                gap,
                padding, 
            )

        let childlistfragment = getContentList({
            orientation,
            cellHeight,
            cellWidth,

            localContentList,
            observer:itemobserver.current,
            indexoffset,
            headindexcount,
            tailindexcount,
        })
        saveContentlist(childlistfragment)

    },[
        cellHeight,
        cellWidth,
        orientation,
        viewportheight,
        viewportwidth,
        runway,
        gap,
        padding,
      ]
    )

    const evaluateContentList = useCallback((
            cellHeight, 
            cellWidth, 
            orientation, 
            viewportheight, 
            viewportwidth, 
            runway, 
            gap,
            padding, 
        ) => {
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
    },[
        orientation, 
        viewportheight, 
        viewportwidth, 
        runway, 
        cellHeight, 
        cellWidth, 
        padding, 
        gap,
    ])

    // render...

    let divlinerstyles = divlinerStylesRef.current
    console.log('divlinerstyles for render return',{...divlinerstyles})

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


const setCradleStyles = (orientation, stylesobject, cellHeight, cellWidth, gap, crosscount, viewportheight, viewportwidth) => {

        let styles = Object.assign({},stylesobject) as React.CSSProperties
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

        return styles
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