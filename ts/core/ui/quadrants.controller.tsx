// quadrants.controller.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence

'use strict'

import * as React from 'react'

import QuadPlatform from './quadspace/quadplatform.view'
import QuadFrame from './quadrant/quadframe.view'
import Quadrant from './quadrant.controller'

const Quadrants = props => {
    let { handleSwap, getDataItem, getListItem, getTypeItem, selectQuadrant, calcQuadrant } = props.toolkit
    let quadtoolkit = {
        getDataItem,
        getListItem,
        getTypeItem,
    }
    let frametoolkit = {
        handleSwap,
        selectQuadrant,
    }

    let {split, quadrantidentifiers, datastacks, currentquad} = props

    return (
        <QuadPlatform 
            currentquad = {currentquad}
            split = {split}
        >
            <QuadFrame
                quadrant = {calcQuadrant(0)}
                split = {split}
                toolkit = {frametoolkit}
            >
                <Quadrant 
                    quadidentifier = {quadrantidentifiers[0]}
                    color = '#e8e8e8' 
                    datastack = {datastacks[0]}
                    toolkit = {quadtoolkit}
                />
            </QuadFrame>
            <QuadFrame
                quadrant = {calcQuadrant(1)}
                toolkit = {frametoolkit}
                split = {split}
            >
                <Quadrant 
                    quadidentifier = {quadrantidentifiers[1]}
                    color = '#e8e8e8' 
                    datastack = {datastacks[1]}
                    toolkit = {quadtoolkit}
                />
            </QuadFrame>
            <QuadFrame
                quadrant = {calcQuadrant(2)}
                toolkit = {frametoolkit}
                split = {split}
            >
                <Quadrant 
                    quadidentifier = {quadrantidentifiers[2]}
                    color = '#e8e8e8' 
                    datastack = {datastacks[2]}
                    toolkit = {quadtoolkit}
                />
            </QuadFrame>
            <QuadFrame
                quadrant = {calcQuadrant(3)}
                toolkit = {frametoolkit}
                split = {split}
            >
                <Quadrant 
                    quadidentifier = {quadrantidentifiers[3]}
                    color = '#e8e8e8' 
                    datastack = {datastacks[3]}
                    toolkit = {quadtoolkit}
                />
            </QuadFrame>
        </QuadPlatform>
    )
}

export default Quadrants