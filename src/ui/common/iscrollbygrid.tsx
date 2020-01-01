// iscrollbygrid                                                                                                      .tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React, {useContext, useState, useRef, useEffect, useLayoutEffect} from 'react'

import { GenericObject } from '../../services/interfaces'

import Viewport, { ScrollContext } from './iscrollbygrid/viewport'
import Scrollblock from './iscrollbygrid/scrollblock'
import Cradle from './iscrollbygrid/cradle'

/*
use grid

use IntersectionObserver, getBoundingClientRect, will-change

use transform:translate to extend the cradle when scrolling?

use context api for scroll

allow list type static or dynamic. Static items can be re-ordered; dynamic items are virtual

viewport
scrollblock
cradle (for items)

allow a position bar at bottom -- scrolling stops (and cradle fades) while 
position bar value is being changed. Position bar gives feedback on location (configureable)

change key for updates

transform out of view items to blank space

allow for dividers

attributes
    trackcount = <number of side by side>
    orientation = horizontal|vertical|any
    // defaultsize
    getnewelement
    size (size of dataset)
    offset 
    generation?? (to trigger updates)
    placeholder (over-rides defaultsize)
    runwaylength
    runwayelements
    inverted (invert scroll orientation)
    headercomponent
    footercomponent

*/

/*

    Sections are:
     - INITIALIZE
     - VIEWPORT
     - SCROLLBLOCK
     - CRADLE
     - ITEMFRAME

*/

// ===================================[ INITIALIZE ]===========================

const IScrollByGrid = (props) => {
    let { 
        orientation, 
        gap, 
        padding, 
        cellLength, 
        cellCrossLength, 
        runway, 
        listsize, 
        offset,
        preload,
        dense, 
        // sortable, // deferred; ignored if preload is false
        placeholder,
        getItem,
    } = props
    // console.log('inside Scroller: orientation', orientation)

    if (!['horizontal','vertical'].includes(orientation)) {
        console.warn('invalid value for scroller orientation; resetting to default',orientation)
        orientation = 'horizontal'
    }

    gap !?? (gap = 0)
    padding !?? (padding = 0)
    runway !?? (runway = 5)
    offset !?? (offset = 0)
    listsize !?? (listsize = 0)
    !preload && (dense = false)
    // !preload && (sortable = false) // deferred

    return <Viewport>
        <Scrollblock

            size = { listsize }
            offset = { offset }
            orientation = { orientation }

        >

            <Cradle 

                gap = { gap }
                padding = { padding }
                cellCrossLength = { cellCrossLength }
                cellLength = { cellLength }
                size = { listsize }
                offset = { offset }
                orientation = { orientation }
                runway = { runway } 
                dense = { dense }

                placeholder = { placeholder }
                getItem = { getItem }

            />

        </Scrollblock>
    </Viewport>

}

export default IScrollByGrid
