// quadrants.controller.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

import QuadPlatform from './quadspace/quadplatform.view'
import QuadFrame from './quadrant/quadframe.view'
import Quadrant from './quadrant.controller'

const Quadrants = props => {

    // repackage callbacks for children
    let { 
        handleSwap, 
        setDocpackPairListener, 
        removeDocpackPairListener,
        selectQuadrant, 
        calcQuadrantPosition,
    } = props.callbacks
    
    let quadcallbacks = {
        setDocpackPairListener,
        removeDocpackPairListener,
    }
    let framecallbacks = {
        handleSwap,
        selectQuadrant,
    }

    // get data for distribution
    let {split, quadrantIdentifiers, datastacks, currentQuadPosition, systemdata, userdata} = props

    enum quad { one, two, three, four } // 0,1,2,3

    return (
        <QuadPlatform 
            currentQuadPosition = {currentQuadPosition}
            split = {split}
        >
            <QuadFrame
                quadrantPosition = {calcQuadrantPosition(quad.one)}
                split = {split}
                callbacks = {framecallbacks}
            >
                <Quadrant 
                    quadidentifier = {quadrantIdentifiers[quad.one]}
                    color = '#e8e8e8' 
                    datastack = {datastacks?datastacks[quad.one]:null}
                    callbacks = {quadcallbacks}
                    systemdata = {systemdata}
                    userdata = {userdata}
                />
            </QuadFrame>
            <QuadFrame
                quadrantPosition = {calcQuadrantPosition(quad.two)}
                callbacks = {framecallbacks}
                split = {split}
            >
                <Quadrant 
                    quadidentifier = {quadrantIdentifiers[quad.two]}
                    color = '#e8e8e8' 
                    datastack = {datastacks?datastacks[quad.two]:null}
                    callbacks = {quadcallbacks}
                    systemdata = {systemdata}
                    userdata = {userdata}
                />
            </QuadFrame>
            <QuadFrame
                quadrantPosition = {calcQuadrantPosition(quad.three)}
                callbacks = {framecallbacks}
                split = {split}
            >
                <Quadrant 
                    quadidentifier = {quadrantIdentifiers[quad.three]}
                    color = '#e8e8e8' 
                    datastack = {datastacks?datastacks[quad.three]:null}
                    callbacks = {quadcallbacks}
                    systemdata = {systemdata}
                    userdata = {userdata}
                />
            </QuadFrame>
            <QuadFrame
                quadrantPosition = {calcQuadrantPosition(quad.four)}
                callbacks = {framecallbacks}
                split = {split}
            >
                <Quadrant 
                    quadidentifier = {quadrantIdentifiers[quad.four]}
                    color = '#e8e8e8' 
                    datastack = {datastacks?datastacks[quad.four]:null}
                    callbacks = {quadcallbacks}
                    systemdata = {systemdata}
                    userdata = {userdata}
                />
            </QuadFrame>
        </QuadPlatform>
    )
}

export default Quadrants