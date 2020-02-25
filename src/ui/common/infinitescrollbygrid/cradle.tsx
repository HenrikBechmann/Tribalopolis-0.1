// cradle.tsx
// copyright (c) 2020 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React, { useState, useRef, useContext, useEffect, useLayoutEffect, useCallback, useMemo } from 'react'

import { ViewportContext } from './viewport'

import ItemShell from './itemshell'

/*
    BUG: integrate gap measurement correctly
    BUG: rapid back and forth scrolling causes loss of content in relation to requirement
        - content should be coerced to calculated length as minimum or listsize whichever is smaller
        - find out why cradlelistsize is shrinkin - suspect disparity between row count and item count in row
            in dropcontent
            - possibly rapid forward and backward movements cause observer to combine deletions from both
            - likely problem is using a sample to determine forward or backward direction of delete; it could be a mix
*/

/*
    1 name states 'pivot' (change orientation) and 'resize'
    - finish resize implementation for vertical
    - implement reisze for horizontal

    - focus on static switch from horizontal to vertical
    2 dynamic switch of orientation (pivot)

    3
    - memoize render output to minimize render
    - integrate contentOffsetForActionRef in all contentlist creation
    - review use of {...styles} copy styles to new objects, in terms of trigger consequences
    - make a cradle count memo
    - change runway to number of items

    4 deal with thumbscroll

    5 implement cellSizing scroller parameter: fixed, variable
    - be careful to reconcile scrollblock and cradle at each end of scrollblock - second IntersectionObserver

    6 implement getItem
    7 add examples 1, 2, 3 to control page: 
        - small 100x100 images, scroll and rotate
        - vertical scroll items inside horizontal scroll, with ability to flip them
        - variable height items

    8 scrollToItem(index[,alignment]) - alignment = start, end, center, auto (default)

*/

const DEBUG = false

const Cradle = (props) => {

    const { gap, padding, runway, listsize, offset, orientation, cellHeight, cellWidth, getItem } = props

    // =============================================================================================
    // --------------------------------------[ initialization ]-------------------------------------

    const [cradlestate, saveCradleState] = useState('setup')
    const cradlestateRef = useRef(null) // for observer call closure
    cradlestateRef.current = cradlestate // most recent value

    DEBUG && console.log('---------------------------')
    DEBUG && console.log('CALLING CRADLE with state',cradlestate)

    const [contentlist,saveContentlist] = useState([])

    const [dropentries, saveDropentries] = useState(null)

    const [addentries, saveAddentries] = useState(null)

    const viewportData = useContext(ViewportContext)

    const itemobserverRef = useRef(null)

    const pauseObserverForReconfigurationRef = useRef(false)

    const targetConfigDataRef = useRef({})

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

    const divlinerStyleRevisionsRef = useRef(null) // for modifications by observer actions

    const contentOffsetForActionRef = useRef(offset || 0) // used for contentList creation; used for orientation change, and resize

    const cradleElementRef = useRef(null)

    const viewportDimensions = useMemo(()=>{

        DEBUG && console.log('calculating viewport dimensions',viewportData)
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
        DEBUG && console.log('calculated crosscount', crosscount)
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

    const crosscountRef = useRef(crosscount) // for easy reference by observer
    const previousCrosscountRef = useRef()
    previousCrosscountRef.current = crosscountRef.current
    crosscountRef.current = crosscount

    // capture previous versions for reconfigure calulations above
    const configDataRef:any = useRef({})
    const previousConfigDataRef:any = useRef({})
    configDataRef.current = useMemo(() => {
        let scrollOffset = (orientation == 'vertical')?viewportData.elementref.current.scrollTop:viewportData.elementref.current.scrollLeft
        let cradleOffset = (orientation == 'vertical')?cradleElementRef.current?.offsetTop:cradleElementRef.current?.offsetLeft

        previousConfigDataRef.current = {scrollOffset, cradleOffset, ...configDataRef.current}

        return {
        cellWidth,
        cellHeight,
        gap,
        padding,
        runway,
        viewportheight,
        viewportwidth,
        crosscount,
    }},[
        cellWidth, 
        cellHeight, 
        gap, 
        padding,
        runway,
        viewportheight, 
        viewportwidth,
        crosscount,
        cradleElementRef.current,
        orientation,
    ])

    divlinerStylesRef.current = useMemo(()=> {

        // merge base style and revisions (by observer)
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

        DEBUG && console.log('setting cradle styles',{...styles})

        return {...styles}
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

    const itemElementsRef = useRef(new Map())

    // =====================================================================================
    // ----------------------------------[ state management ]-------------------------------

    // triggering next state phase: states = setup, pivot, resize, scroll (was run)
    useEffect(()=> {
        DEBUG && console.log('state transformation block, from', cradlestate)
        switch (cradlestate) {
            case 'pivot':
                DEBUG && console.log('setting cradlestate from pivot to setup')
                saveCradleState('setup')
                break
            case 'setup': 
                DEBUG && console.log('setting cradlestate from setup to initobserver')
                saveCradleState('initobserver')
                break
            case 'resize':
                DEBUG && console.log('setting cradlestate from resize to reset')
                saveCradleState('reset')
                break
            case 'reset':
                DEBUG && console.log('setting cradlestate from reset to settle')
                saveCradleState('settle')
                break;
            case 'settle':
                DEBUG && console.log('setting cradlestate from settle to ready')
                setTimeout(()=>{ // let everything settle before reviving observer
                    DEBUG && console.log('observer pause ended')
                    pauseObserverForReconfigurationRef.current = false
                },250) // timeout a bit spooky but gives observer initialization of new items a chance to settle
                    // observer seems to need up to 2 cycles to settle; one for each side of the cradle.
                saveCradleState('ready')
                break;
            case 'ready':
                // do nothing
                break
        }
    },[cradlestate])  

    // trigger resize on change
    useEffect(()=>{
        if (cradlestate == 'ready') {
            DEBUG && console.log('setting cradlestate from ready to resize')
            contentOffsetForActionRef.current = contentlist[0]?.props.index
            pauseObserverForReconfigurationRef.current = true
            let cradleElement = cradleElementRef.current
            targetConfigDataRef.current = {...previousConfigDataRef.current}
            saveCradleState('resize')
        }
    },[
        cellWidth, 
        cellHeight, 
        gap, 
        padding,
        runway,
        viewportheight, 
        viewportwidth,
    ])

    // trigger pivot on change in orientation
    useEffect(()=> {

        DEBUG && console.log('initializing system with cradlestate',cradlestate)
        let rootMargin
        if (orientation == 'horizontal') {
            rootMargin = `0px ${runway}px 0px ${runway}px`
        } else {
            rootMargin = `${runway}px 0px ${runway}px 0px`
        }
        DEBUG && console.log('rootMargin',rootMargin)
        itemobserverRef.current = new IntersectionObserver(
            itemobservercallback,
            {root:viewportData.elementref.current, rootMargin,} 
        )
        saveContentlist([])
        if (cradlestate != 'setup') {
            DEBUG && console.log(`setting cradlestate from ${cradlestate} to pivot`,)            
            saveCradleState('pivot')
        }

    },[orientation])

    // =================================================================================
    // -------------------------[ IntersectionObserver support]-------------------------

    // "head" is right for scrollforward; left for not scrollforward (scroll backward)
    // "tail" is left for scrollforward; right for not scrollforward (scroll backward)

    // the async callback from IntersectionObserver. this is a closure
    const itemobservercallback = useCallback((entries)=>{

        if (pauseObserverForReconfigurationRef.current) {
            // if (dropentries.length == 0) return
            DEBUG && console.log('observer paused for configuration, cradlestate',cradlestateRef.current)
            return
        }

        if (cradlestateRef.current == 'ready') { // first pass is after setBaseContent, no action required
            let dropentries = entries.filter(entry => (!entry.isIntersecting))
            DEBUG && console.log('observer processing scroll items to drop', dropentries.length)

            if (dropentries.length) {

                saveDropentries(dropentries)

            }
        }
        if (cradlestateRef.current == 'initobserver') {
            DEBUG && console.log('setting cradlestate from initobserver to ready',)            
            saveCradleState('ready')
        }
    },[])

    // drop scroll content
    useEffect(()=>{
        if (dropentries === null) return

        DEBUG && console.log('processing dropentries; cradlestate',dropentries, cradlestateRef.current)
        let sampleEntry = dropentries[0]

        let cradleElement = cradleElementRef.current
        let parentElement = cradleElement.parentElement
        let viewportElement = viewportData.elementref.current

        let tailpos
        let headpos
        let scrollforward
        let localContentList

        // TODO: correct this! it could be a combination
        // -- isolate forward and backward lists
        // set scrollforward
        let forwardcount = 0, backwardcount = 0
        for (let droprecordindex = 0; droprecordindex <dropentries.length; droprecordindex++ ) {
            if (orientation == 'vertical') {

                if (sampleEntry.boundingClientRect.y - sampleEntry.rootBounds.y < 0) {
                    forwardcount++
                } else {
                    backwardcount++
                }
            
            } else {
            
                if (sampleEntry.boundingClientRect.x - sampleEntry.rootBounds.x < 0) {
                    forwardcount++
                } else {
                    backwardcount++
                }
            
            }
        }

        let netshift = forwardcount - backwardcount
        if (netshift == 0) return

        scrollforward = (forwardcount > backwardcount)

        // console.log('drop scroll content: forwardcount, backwardcount, netshift, scrollforward',
        //     forwardcount, backwardcount, netshift, scrollforward)

        netshift = Math.abs(netshift)

        // set localContentList
        let indexoffset = contentlist[0].props.index
        let pendingcontentoffset
        let newcontentcount = Math.ceil(netshift/crosscountRef.current)*crosscountRef.current
        DEBUG && console.log('dropentries newcontentcount, netshift, crosscountRef.current', newcontentcount, netshift, crosscountRef.current)
        let headindexcount, tailindexcount
        if (scrollforward) {
            pendingcontentoffset = indexoffset + netshift
            let proposedtailoffset = pendingcontentoffset + newcontentcount + ((contentlist.length - netshift ) - 1)

            if ((proposedtailoffset) > (listsize -1) ) {
                DEBUG && console.log('the calculated newcontentcount value, before revision',newcontentcount)
                newcontentcount -= (proposedtailoffset - (listsize -1))
                DEBUG && console.log('dropitem: dropentries.length, contentlist.length, pendingcontentoffset,newcontentcount,proposedtailoffset,listsize',
                    dropentries.length, contentlist.length, pendingcontentoffset,newcontentcount, proposedtailoffset, listsize)
                if (newcontentcount <=0) { // should never below 0 -- TODO: verify and create error if fails
                    return // ugly
                }
            }

            headindexcount = -netshift
            tailindexcount = 0

        } else {

            pendingcontentoffset = indexoffset
            let proposedindexoffset = pendingcontentoffset - newcontentcount
            if (proposedindexoffset < 0) {
                DEBUG && console.log('scrollbackward calculated newcontentcount, proposedindexoffset',newcontentcount, proposedindexoffset)
                proposedindexoffset = -proposedindexoffset
                newcontentcount = newcontentcount - proposedindexoffset
                DEBUG && console.log('scrollbackward resulting newcontentcount, proposedindexoffset, pendingcontentoffset',
                    newcontentcount, proposedindexoffset, pendingcontentoffset)
                if (newcontentcount <= 0) {
                    return // ugly
                }
            }

            headindexcount = 0
            tailindexcount = -netshift

        }

        localContentList = getContentList(
            {

                indexoffset,
                localContentList:contentlist,
                headindexcount,
                tailindexcount,
                callbacksRef,

            })

        let styles = {} as React.CSSProperties // {...divlinerStylesRef.current}

        // set styles revisions
        if (orientation == 'vertical') {

            let offsetTop = cradleElement.offsetTop
            let offsetHeight = cradleElement.offsetHeight
            let parentHeight = parentElement.offsetHeight
            styles.left = 'auto'
            styles.right = 'auto'

            if (scrollforward) {

                tailpos = offsetTop + offsetHeight
                styles.top = 'auto'
                styles.bottom = (parentHeight - tailpos) + 'px'

            } else {

                headpos = offsetTop
                styles.top = headpos + 'px'
                styles.bottom = 'auto'

            }

        } else {

            let offsetLeft = cradleElement.offsetLeft
            let offsetWidth = cradleElement.offsetWidth
            let parentWidth = parentElement.offsetWidth
            styles.top = 'auto'
            styles.bottom = 'auto'

            if (scrollforward) {

                tailpos = offsetLeft + offsetWidth
                styles.left = 'auto'
                styles.right = (parentWidth - tailpos) + 'px'

            } else {

                headpos = offsetLeft
                styles.left = headpos + 'px'
                styles.right = 'auto'

            }
        }

        DEBUG && console.log('dropentries styles',{...styles}, localContentList, scrollforward)

        divlinerStyleRevisionsRef.current = { ...styles }

        saveContentlist(localContentList) // delete entries
        saveDropentries(null)
        saveAddentries({count:newcontentcount,scrollforward,contentoffset:pendingcontentoffset})
        DEBUG && console.log('end of drop entries')

    },[dropentries])

    // add scroll content
    useEffect(()=>{
        if (addentries === null) return
        DEBUG && console.log('processing addentries',addentries)

        let cradleElement = cradleElementRef.current
        let parentElement = cradleElement.parentElement
        let viewportElement = viewportData.elementref.current

        let tailpos
        let headpos

        let { scrollforward } = addentries
        let localContentList

        // set localContentList
        let { contentoffset, count:newcontentcount } = addentries

        let headindexcount, tailindexcount
        if (scrollforward) {

            headindexcount = 0,
            tailindexcount =  newcontentcount

        } else {

            headindexcount = newcontentcount
            tailindexcount = 0

        }

        localContentList = getContentList({
            localContentList: contentlist,
            headindexcount,
            tailindexcount,
            indexoffset: contentoffset,
            orientation,
            cellHeight,
            cellWidth,
            observer: itemobserverRef.current,
            crosscount,
            callbacksRef,
        })

        let styles = {} as React.CSSProperties

        // set style revisions
        if (orientation == 'vertical') {

            let offsetTop = cradleElement.offsetTop
            let offsetHeight = cradleElement.offsetHeight
            let parentHeight = parentElement.offsetHeight
            styles.left = 'auto'
            styles.right = 'auto'

            if (scrollforward) {

                headpos = offsetTop
                styles.top = headpos + 'px'
                styles.bottom = 'auto'

            } else { // scroll backward

                tailpos = offsetTop + offsetHeight
                styles.top = 'auto'
                styles.bottom = (parentHeight - tailpos) + 'px'

            }
            DEBUG && console.log('add content scrollforward, headpos, tailpos, styles',scrollforward, headpos, tailpos, styles)

        } else {

            let offsetLeft = cradleElement.offsetLeft
            let offsetWidth = cradleElement.offsetWidth
            let parentWidth = parentElement.offsetWidth
            styles.top = 'auto'
            styles.bottom = 'auto'

            if (scrollforward) {

                headpos = offsetLeft
                styles.left = headpos + 'px'
                styles.right = 'auto'

            } else { // scroll backward

                tailpos = offsetLeft + offsetWidth
                styles.left = 'auto'
                styles.right = (parentWidth - tailpos) + 'px'

            }

        }

        DEBUG && console.log('addentries headpos, styles, localContentList', headpos, {...styles}, localContentList)

        divlinerStyleRevisionsRef.current = {...styles}
        saveContentlist(localContentList)
        saveAddentries(null)
        DEBUG && console.log('end of processing addentries')

    },[addentries])
    // End of IntersectionObserver support

    // ========================================================================================
    // -------------------------------[ Assembly of content]-----------------------------------
    
    // set cradle content for state changes
    useEffect(() => {

        if (['setup','resize','pivot'].indexOf(cradlestate) == -1) return

        DEBUG && console.log('cradlestate for setcradlecontent',cradlestate)

        setCradleContent()

    },[
        cradlestate,
      ]
    )

    const setCradleContent = useCallback(() => {

        let localContentList = [] // any existing items will be re-used by react

        let {indexoffset, headindexcount, tailindexcount} = 
            evaluateContentList({ // internal
                cellHeight, 
                cellWidth, 
                orientation, 
                viewportheight, 
                viewportwidth, 
                runway, 
                gap,
                padding,
                cradlestate, 
                contentOffsetForActionRef,
                crosscount,
            })

        let childlistfragment = getContentList({

            orientation,
            cellHeight,
            cellWidth,

            localContentList,
            observer:itemobserverRef.current,
            indexoffset,
            headindexcount,
            tailindexcount,
            crosscount,
            callbacksRef,

        })

        DEBUG && console.log('childlistfragment',childlistfragment)
        // DEBUG && console.log('targetConfigDataRef',{...targetConfigDataRef.current})
        console.log('targetConfigDataRef',{...targetConfigDataRef.current})
        let styles:React.CSSProperties = {}
        let cradleoffset
        if (orientation == 'vertical') {
            cradleoffset = (Math.ceil( (indexoffset/crosscount)) * (cellHeight + gap))

            styles.top = cradleoffset + 'px'
            styles.bottom = 'auto'
            styles.left = 'auto'
            styles.right = 'auto'

            let scrolloffset = cradleoffset + runway
            // if (scrolloffset < 0) {
            //     scrolloffset = 0
            // }
            DEBUG && console.log('indexoffset, cradleoffset, scrolloffset', indexoffset, cradleoffset, scrolloffset)

            DEBUG && console.log('viewport indexoffset, crosscount, cellHeight, gap, padding, cradleoffset, scrolloffset, runway, element', 
                indexoffset, crosscount,  cellHeight, gap, padding, cradleoffset, scrolloffset, runway, viewportData.elementref.current)
            viewportData.elementref.current.scrollTop = scrolloffset
        } else { // orientation = 'horizontal'

            cradleoffset = ((Math.ceil((indexoffset)/crosscount)) * (cellWidth + gap)) - gap

            styles.top = 'auto'
            styles.bottom = 'auto'
            styles.left = cradleoffset + 'px'
            styles.right = 'auto'

            let scrolloffset = cradleoffset

            viewportData.elementref.current.scrollLeft = scrolloffset
        }
        divlinerStyleRevisionsRef.current = styles
        contentOffsetForActionRef.current = indexoffset
        DEBUG && console.log('setCradleContent style revisions, indexoffset',styles, indexoffset, childlistfragment)
        // pauseObserverForReconfigurationRef.current = false
        saveContentlist(childlistfragment) // external

    },[
        cellHeight,
        cellWidth,
        orientation,
        viewportheight,
        viewportwidth,
        runway,
        gap,
        padding,
        crosscount,
      ]
    )

    // evaluate content for requirements
    const evaluateContentList = useCallback(({
            cellHeight, 
            cellWidth, 
            orientation, 
            viewportheight, 
            viewportwidth, 
            runway, 
            gap,
            padding, 
            cradlestate, 
            contentOffsetForActionRef,
            crosscount
        }) => {
        let indexoffset = (contentOffsetForActionRef.current || 0), headindexcount = 0, tailindexcount = 0
        DEBUG && console.log('original indexoffset in evaluateContentList', indexoffset)
        let shift
        if (indexoffset != 0) {
            shift = indexoffset % crosscount;
            // shift = crosscount - shift;
            (shift) && DEBUG && console.log(`shifting indexoffset from ${indexoffset} to ${indexoffset - shift} with ${shift}`);
            (shift) && (indexoffset -= shift)
        }
        let cradlelength, localcelllength
        if (orientation == 'vertical') {
            cradlelength = (viewportheight + (padding * 2) - gap)
            localcelllength = cellHeight + gap
        } else {
            cradlelength = (viewportwidth + (padding * 2) - gap)
            localcelllength = cellWidth + gap
        }
        cradlelength += (runway * 2)
        let cradlecontentCount = Math.ceil(cradlelength/localcelllength) * crosscount
        DEBUG && console.log('calculated indexoffset, shift, cradlecontentCount, runway, cradlelength, cellLength, crosscount',
            indexoffset, shift, cradlecontentCount, runway, cradlelength, localcelllength, crosscount)
        if (cradlecontentCount > listsize) cradlecontentCount = listsize

        // debugger
        // shift cradlecontent back to accommodate size
        let diffcountoffset
        if ((cradlecontentCount + indexoffset + 1) > listsize) {
            diffcountoffset = (cradlecontentCount + indexoffset + 1) - listsize
            shift = (diffcountoffset) % crosscount
            if (shift) {
                diffcountoffset -= shift
            }
            indexoffset -= diffcountoffset                
            DEBUG && console.log('adjusted for listsize, diffcountoffset, cradlecontentCount, indexoffset, listsize, shift', diffcountoffset, cradlecontentCount, indexoffset, listsize, shift)
        }
        if (indexoffset < 0) {
            console.warn('indexoffset < 0 in evaluateContentList', indexoffset)
        }
        tailindexcount = cradlecontentCount

        DEBUG && console.log('evaluated content list: diffcount, shift, cradlecontentCount, indexoffset, headindexcount, tailindexcount', diffcountoffset, shift, cradlecontentCount, indexoffset, headindexcount, tailindexcount)

        return {indexoffset, headindexcount, tailindexcount} // summarize requirements message
    },[
        orientation, 
        viewportheight, 
        viewportwidth, 
        runway, 
        cellHeight, 
        cellWidth, 
        padding, 
        gap,
        cradlestate, 
        crosscount,
        contentOffsetForActionRef,
    ])
    // =============================================================================
    // ------------------------------[ child callbacks ]----------------------------------

    const getItemElementData = useCallback((itemElementData, reportType) => {

        const [index, shellref] = itemElementData

        if (reportType == 'register') {

            itemElementsRef.current.set(index,shellref)

        } else if (reportType == 'unregister') {

            itemElementsRef.current.delete(index)

        }

    },[])

    const callbacksRef = useRef({
        getElementData:getItemElementData
    })

    // =============================================================================
    // ------------------------------[ render... ]----------------------------------

    let divlinerstyles = divlinerStylesRef.current
    DEBUG && console.log('divlinerstyles for render return',{...divlinerstyles})

    // no result if styles not set
    return <div 
            ref = {cradleElementRef} 
            style = {divlinerstyles}
          >
            {divlinerstyles.width?contentlist:null}
          </div>
        

} // Cradle

/******************************************************************************************
 ------------------------------------[ SUPPORTING FUNCTIONS ]------------------------------
*******************************************************************************************/

// styles
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

// TODO: check cradlelistsize is adequate.
// update content
// adds itemshells at start of end of contentlist according to headindexcount and tailindescount,
// or if indexcount values are <0 removes them.
const getContentList = (props) => {

    let { 
        indexoffset, 
        headindexcount, 
        tailindexcount, 
        orientation, 
        cellHeight, 
        cellWidth, 
        localContentList:contentlist,
        observer,
        crosscount,
        callbacksRef,
    } = props

    let localContentlist = [...contentlist]
    let tailindexoffset = indexoffset + contentlist.length
    let returnContentlist
    let headContentlist = []
    if (headindexcount >= 0) {

        DEBUG && console.log('adding head items, indexoffset, headindexcount',indexoffset,headindexcount)
        for (let index = indexoffset - headindexcount; index < (indexoffset); index++) {
            headContentlist.push(<ItemShell
                key = {index} 
                orientation = {orientation}
                text = { index + 1}
                cellHeight = { cellHeight }
                cellWidth = { cellWidth }
                index = {index}
                observer = {observer}
                callbacks = {callbacksRef}
            />)
        }

    } else {

        localContentlist.splice(0,-headindexcount)

    }

    let tailContentlist = []
    if (tailindexcount >= 0) {

        DEBUG && console.log('adding tail items',tailindexoffset,tailindexcount, indexoffset, contentlist.length)
        for (let index = tailindexoffset; index <(tailindexoffset + tailindexcount); index++) {
            tailContentlist.push(<ItemShell
                key = {index} 
                orientation = {orientation}
                text = { index + 1}
                cellHeight = { cellHeight }
                cellWidth = { cellWidth }
                index = {index}
                observer = {observer}
                callbacks = {callbacksRef}
            />)
        }

    } else {

        localContentlist.splice(tailindexcount,-tailindexcount)

    }

    returnContentlist = headContentlist.concat(localContentlist,tailContentlist)

    return returnContentlist
}

export default Cradle