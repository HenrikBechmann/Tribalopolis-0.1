// quadrants.controller.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence

'use strict'

import React from 'react'

import QuadPlatform from './quadspace/quadplatform.view'
import QuadFrame from './quadrant/quadframe.view'
import Quadrant from './quadrant.controller'

const Quadrants = props => {

    // repackage callbacks for children
    let { handleSwap, getItem, getList, getType, selectQuadrant, calcQuadrantPosition } = props.callbacks
    let quadcallbacks = {
        getItem,
        getList,
        getType,
    }
    let framecallbacks = {
        handleSwap,
        selectQuadrant,
    }

    // get data for distribution
    let {split, quadrantIdentifiers, datastacks, currentQuadPosition} = props

    enum instance { one, two, three, four } // 0,1,2,3

    return (
        <QuadPlatform 
            currentQuadPosition = {currentQuadPosition}
            split = {split}
        >
            <QuadFrame
                quadrantPosition = {calcQuadrantPosition(instance.one)}
                split = {split}
                callbacks = {framecallbacks}
            >
                <Quadrant 
                    quadidentifier = {quadrantIdentifiers[instance.one]}
                    color = '#e8e8e8' 
                    datastack = {datastacks[instance.one]}
                    callbacks = {quadcallbacks}
                />
            </QuadFrame>
            <QuadFrame
                quadrantPosition = {calcQuadrantPosition(instance.two)}
                callbacks = {framecallbacks}
                split = {split}
            >
                <Quadrant 
                    quadidentifier = {quadrantIdentifiers[instance.two]}
                    color = '#e8e8e8' 
                    datastack = {datastacks[instance.two]}
                    callbacks = {quadcallbacks}
                />
            </QuadFrame>
            <QuadFrame
                quadrantPosition = {calcQuadrantPosition(instance.three)}
                callbacks = {framecallbacks}
                split = {split}
            >
                <Quadrant 
                    quadidentifier = {quadrantIdentifiers[instance.three]}
                    color = '#e8e8e8' 
                    datastack = {datastacks[instance.three]}
                    callbacks = {quadcallbacks}
                />
            </QuadFrame>
            <QuadFrame
                quadrantPosition = {calcQuadrantPosition(instance.four)}
                callbacks = {framecallbacks}
                split = {split}
            >
                <Quadrant 
                    quadidentifier = {quadrantIdentifiers[instance.four]}
                    color = '#e8e8e8' 
                    datastack = {datastacks[instance.four]}
                    callbacks = {quadcallbacks}
                />
            </QuadFrame>
        </QuadPlatform>
    )
}

export default Quadrants