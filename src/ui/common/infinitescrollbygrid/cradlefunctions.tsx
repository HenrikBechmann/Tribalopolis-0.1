// cradlefunctions.tsx
// copyright (c) 2020 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

/******************************************************************************************
 ------------------------------------[ SUPPORTING FUNCTIONS ]------------------------------
*******************************************************************************************/

import React from 'react'

import ItemShell from './itemshell'

// styles
export const setCradleStyles = (orientation, stylesobject, cellHeight, cellWidth, gap, crosscount, viewportheight, viewportwidth) => {

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
