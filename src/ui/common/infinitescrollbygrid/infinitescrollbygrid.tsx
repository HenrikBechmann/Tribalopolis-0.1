// iscrollbygrid                                                                                                      .tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

import Viewport from './viewport'
import Scrollblock from './scrollblock'
import Cradle from './cradle'

// let Viewport = await import('./viewport')
// ===================================[ INITIALIZE ]===========================

/*
    The only job of IScrollByGrid is to pass paramters to dependents
    Viewport contains the scrollblock (scrolling block)
    Scrollblock represents the entirety of the list, and scrolls
    Cradle contains the list items, and is 'virtualiized' -- it appears as
      though it is the full scrollblock, but in fact it is only slightly larger than
      the viewport.
    - individual items are framed by ItemFrame, managed by Cradle
*/
const InfiniteScrollByGrid = (props) => {
    let { 
        orientation, 
        gap, 
        padding, 
        cellHeight, 
        cellWidth, 
        runway, 
        listsize, 
        offset,
        getItem,
        // preload, // boolean
        // dense, // boolean
        cellSizing, // 'fixed' || 'variable' default 'symmetrical'
    } = props
    // console.log('inside Scroller: orientation', orientation)

    if (!['horizontal','vertical'].includes(orientation)) {
        console.warn('invalid value for scroller orientation; resetting to default',orientation)
        orientation = 'horizontal'
    }

    gap !?? (gap = 0)
    padding !?? (padding = 0)
    runway !?? (runway = 3)
    offset !?? (offset = 0)
    listsize !?? (listsize = 0)
    let runwaylength = (orientation == 'vertical')?(runway * (cellHeight + gap)):(runway * (cellWidth + gap))
    // implementatoin deferred for the following
    // dense !?? (dense = false)
    // !preload && (dense = false) // preload will allow dragdrop
    cellSizing !?? (cellSizing = 'fixed')

    return <Viewport orientation = {orientation} runwaylength = {runwaylength}>
        <Scrollblock

            listsize = { listsize }
            cellWidth = { cellWidth }
            cellHeight = { cellHeight }
            gap = { gap}
            padding = { padding }
            orientation = { orientation }

        >

            <Cradle 

                gap = { gap }
                padding = { padding }
                cellWidth = { cellWidth }
                cellHeight = { cellHeight }
                listsize = { listsize }
                offset = { offset }
                orientation = { orientation }
                runwaylength = { runwaylength } 
                // dense = { dense }
                // preload = { preload }
                getItem = { getItem }

            />

        </Scrollblock>
    </Viewport>

}

export default InfiniteScrollByGrid
