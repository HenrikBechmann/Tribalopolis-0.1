// cradlefunctions.tsx
// copyright (c) 2020 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

/******************************************************************************************
 ------------------------------------[ SUPPORTING FUNCTIONS ]------------------------------
*******************************************************************************************/

import React from 'react'

import ItemShell from './itemshell'

// triggered by transition to ready state, and by cancellation of isScrolling mode
export const calcVisibleItems = (itemsArray, viewportElement, cradleElement) => {
    // console.log('calcVisibleItems itemsArray.length',itemsArray.length)
    let list = []
    let cradleTop = cradleElement.offsetTop, 
        cradleLeft = cradleElement.offsetLeft
    let scrollblockTopOffset = -viewportElement.scrollTop, 
        scrollblockLeftOffset = -viewportElement.scrollLeft,
        viewportHeight = viewportElement.offsetHeight,
        viewportWidth = viewportElement.offsetWidth,
        viewportTopOffset = -scrollblockTopOffset,
        viewportBottomOffset = -scrollblockTopOffset + viewportHeight

    // console.log('calculating visible items: cradleTop, cradleLeft, scrollblockTopOffset, scrollblockLeftOffset, viewportHeight, viewportWidth, viewportBottomOffset, itemsArray',
    //     cradleTop, cradleLeft, scrollblockTopOffset, scrollblockLeftOffset, viewportHeight, viewportWidth, viewportBottomOffset, itemsArray)

    for (let i = 0; i < itemsArray.length; i++) {

        let [index, elementRef] = itemsArray[i]
        let element = elementRef.current

        let top = element.offsetTop, 
            left = element.offsetLeft, 
            width = element.offsetWidth, 
            height = element.offsetHeight,
            right = left + width,
            bottom = top + height

        let 
            itemTopOffset = scrollblockTopOffset + cradleTop + top, // offset from top of viewport
            itemBottomOffset = scrollblockTopOffset + cradleTop + bottom, // offset from top of viewport
            itemLeftOffset = scrollblockLeftOffset + cradleLeft + left, 
            itemRightOffset = scrollblockLeftOffset + cradleLeft + right 


        let isVisible = false // default

        let topPortion,
            bottomPortion,
            leftPortion,
            rightPortion

        // console.log('preparing to evaluate for visibility for index',index,itemTopOffset, itemBottomOffset, viewportHeight)
        // console.log('inputs scrollblockTopOffset, top, bottom, cradleTop',scrollblockTopOffset, top, bottom, cradleTop)
        if ((itemTopOffset < 0) && (itemBottomOffset > 0)) {
            isVisible = true
            bottomPortion = itemBottomOffset
            topPortion = bottomPortion - height
        } else if ((itemTopOffset > 0) && (itemBottomOffset < viewportHeight)) {
            isVisible = true
            topPortion = height
            bottomPortion = 0
        } else if ((itemTopOffset > 0) && ((itemTopOffset - viewportHeight) < 0)) {
            isVisible = true
            topPortion = viewportHeight - itemTopOffset
            bottomPortion = topPortion - height
        } else {
            // console.log('WARNING:no visible criteria found for index', index)
            continue
        }

        if (itemLeftOffset < 0 && itemRightOffset > 0) {
            rightPortion = itemRightOffset
            leftPortion = rightPortion - width
        } else if (itemLeftOffset > 0 && itemRightOffset < viewportWidth) {
            leftPortion = width
            rightPortion = 0
        } else if (itemLeftOffset > 0 && (itemLeftOffset - viewportWidth) < 0) {
            leftPortion = viewportWidth - itemLeftOffset
            rightPortion = leftPortion - width
        }

        // console.log('index: itemTopOffset, itemBottomOffset, viewportBottomOffset, viewportHeight',
        //     index, itemTopOffset, itemBottomOffset, viewportBottomOffset, viewportHeight)

        let verticalRatio = (topPortion > 0)?topPortion/height:bottomPortion/height,
            horizontalRatio = (leftPortion > 0)?leftPortion/width:rightPortion/height

        let itemData = {
            index,
            isVisible,
            top,
            right,
            bottom,
            left,
            width,
            height,
            itemTopOffset,
            itemBottomOffset,
            topPortion,
            bottomPortion,
            itemLeftOffset,
            itemRightOffset,
            leftPortion,
            rightPortion,
            verticalRatio,
            horizontalRatio,
        }

        list.push(itemData)

    }

    list.sort((a,b) => {
        return (a.index - b.index)
    })

    // console.log('returning  list',list.length)

    return list
}

// evaluate content for requirements
export const evaluateContentList = ({
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
        listsize
    }) => {
    // start with indexoffset from when evaluation was triggered
    let indexoffset = (contentOffsetForActionRef.current || 0), headindexcount = 0, tailindexcount = 0
    //  console.log('original indexoffset in evaluateContentList', indexoffset)
    // shift the offset to conform to crosscount multiple
    if (indexoffset != 0) {
        let shift
        shift = indexoffset % crosscount;
        // shift = crosscount - shift;
        // (shift) && console.log(`shifting indexoffset from ${indexoffset} to ${indexoffset - shift} with ${shift}`);
        (shift) && (indexoffset -= shift)
    }
    let cradlelength, localcelllength
    if (orientation == 'vertical') {
        cradlelength = (viewportheight + (padding * 2) - gap) // assumes at least one item
        localcelllength = cellHeight + gap
    } else {
        cradlelength = (viewportwidth + (padding * 2) - gap)
        localcelllength = cellWidth + gap
    }
    
    cradlelength += (runway * 2)
    let cradlecontentCount = Math.ceil(cradlelength/localcelllength) * crosscount

    // console.log('calculated indexoffset, cradlecontentCount, runway, cradlelength, cellLength, crosscount',
        // indexoffset, cradlecontentCount, runway, cradlelength, localcelllength, crosscount)

    if (cradlecontentCount > listsize) cradlecontentCount = listsize

    // debugger
    // shift cradlecontent back by lowering indexoffset to accommodate size
    let diffcountoffset
    if ((cradlecontentCount + indexoffset + 1) > listsize) {
        diffcountoffset = (cradlecontentCount + indexoffset + 1) - listsize
        let shift = (diffcountoffset) % crosscount
        if (shift) {
            diffcountoffset -= shift
        }
        indexoffset -= diffcountoffset                
        // console.log('adjusted for listsize, diffcountoffset, cradlecontentCount, indexoffset, listsize, shift', diffcountoffset, cradlecontentCount, indexoffset, listsize, shift)
    }
    if (indexoffset < 0) { // shouldn't happen
        console.warn('indexoffset < 0 in evaluateContentList', indexoffset)
    }
    tailindexcount = cradlecontentCount

    // console.log('evaluated content list: diffcount, cradlecontentCount, indexoffset, headindexcount, tailindexcount', diffcountoffset, cradlecontentCount, indexoffset, headindexcount, tailindexcount)

    return {indexoffset, headindexcount, tailindexcount} // summarize requirements message
}

export const getVisibleTargetData = (targetConfigDataRef) => {
    let targetvisibleindex, targetscrolloffset

    return [targetvisibleindex, targetscrolloffset]

}

// TODO: check cradlelistsize is adequate.
// update content
// adds itemshells at start of end of contentlist according to headindexcount and tailindescount,
// or if indexcount values are <0 removes them.
export const getContentList = (props) => {

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

        // console.log('adding head items, indexoffset, headindexcount',indexoffset,headindexcount)
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

        // console.log('adding tail items',tailindexoffset,tailindexcount, indexoffset, contentlist.length)
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

// ========================================================================================
// ------------------------------------[ styles ]------------------------------------------

export const setCradleStyles = ({

    orientation, 
    divlinerStyles:stylesobject, 
    cellHeight, 
    cellWidth, 
    gap, 
    crosscount, 
    viewportheight, 
    viewportwidth

}) => {

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

export const setCradleStyleRevisionsForDrop = ({ 
    cradleElement, 
    parentElement, 
    scrollforward, 
    tailpos, 
    headpos, 
    orientation 
}) => {

    let styles = {} as React.CSSProperties

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

    return styles

}

export const setCradleStyleRevisionsForAdd = ({
    cradleElement,
    parentElement,
    scrollforward,
    headpos,
    tailpos,
    orientation,
}) => {
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
        // console.log('add content scrollforward, headpos, tailpos, styles',scrollforward, headpos, tailpos, styles)

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

    return styles

}