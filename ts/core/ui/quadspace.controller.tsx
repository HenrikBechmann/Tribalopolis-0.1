// quad.controller.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence

'use strict'

import * as React from 'react'

// import { connect } from 'react-redux'

import QuadToolsStrip from './quadspace/quadtoolsstrip.view'
import QuadSpaceFrame from './quadspace/quadspaceframe.view'
import QuadBasket from './quadspace/quadbasket.view'
import QuadViewport from './quadspace/quadviewport.view'
import QuadPlatform from './quadspace/quadplatform.view'
import QuadDiamond from './quadspace/quaddiamond.view'
import QuantityBadge from './common/quantitybadge.view'
import QuadStatusBar from './quadspace/quadstatusbar.view'

import QuadFrame from './quadrant/quadframe.view'
import Quadrant from './quadrant.controller'
import { METATYPES } from '../constants'

import {lists, links, items, types, schemes, datastacks, maps} from '../../data/repositories'

class QuadspaceController extends React.Component<any,any> {

    state = {
        quadrantpositions:[0,1,2,3],
        currentquad:'topleft',
        split:'none',
        datastacks,
    }

    positions = [
        'topleft',
        'topright',
        'bottomleft',
        'bottomright',
    ]

    // for swap
    quadmap = {
        topleft:{
            vertical:'bottomleft',
            horizontal:'topright',
            diagonal:'bottomright',
        },
        topright:{
            vertical:'bottomright',
            horizontal:'topleft',
            diagonal:'bottomleft',
        },
        bottomleft:{
            vertical:'topleft',
            horizontal:'bottomright',
            diagonal:'topright',
        },
        bottomright:{
            vertical:'topright',
            horizontal:'bottomleft',
            diagonal:'topleft',
        },
    }

    takingfocus = (quadrantname) => {
        this.setState({
            currentquad:quadrantname,
        })
    }

    changeSplit = (split) => {
        this.setState({
            split,
        },() => {
            setTimeout(() => {
                this.forceUpdate() // for scroll icons
            },600)
        })
    }

    handleSwap = (quadrant,direction) => {

        let { quadrantpositions } = this.state

        let sourcequadindex = this.positions.indexOf(quadrant)

        let targetquad = this.quadmap[quadrant][direction]
        let targetquadindex = this.positions.indexOf(targetquad)

        let sourceidindex = quadrantpositions[sourcequadindex]
        let targetidindex = quadrantpositions[targetquadindex]

        // the swap
        quadrantpositions[sourcequadindex] = targetidindex
        quadrantpositions[targetquadindex] = sourceidindex

        this.setState({
            quadrantpositions
        })

    }

    calcQuadrant = (sessionid) => {
        let pos = this.state.quadrantpositions.indexOf(sessionid)
        return this.positions[pos]
    }

    selectQuadrant = quadrant => {
        this.setState({
            currentquad:quadrant,
        },() => {
            setTimeout(() =>{
                this.setState({
                    split:'none',
                },() => {
                    setTimeout(()=>{
                        this.forceUpdate()
                    },600)
                })
            },600)
        })
    }

    getDataItem = (dataref) => {
        return items[dataref.uid]
    }

    getListItem = (dataref) => {
        return lists[dataref.uid]
    }

    // TODO: should always return an object
    getTypeItem = (metatype,dataref) => {
        let typeitem
        if ( types[METATYPES[metatype]][dataref.schemeuid] ) {
            typeitem = types[METATYPES[metatype]][dataref.schemeuid][dataref.uid] ||
                types[METATYPES[metatype]][dataref.schemeuid]['__default__']

        }
        typeitem = typeitem || null
        return typeitem
    }

    quadrants = () => {
        let { handleSwap, getDataItem, getListItem, getTypeItem } = this
        let toolkit = {
            getDataItem,
            getListItem,
            getTypeItem,
        }
        return [
        <QuadFrame
            key = '1'
            quadrant = {this.calcQuadrant(0)}
            handleSwap = {handleSwap}
            split = {this.state.split}
            selectQuadrant = {this.selectQuadrant}
        >
            <Quadrant 
                uid = '1'
                color = '#e8e8e8' 
                datastack = {this.state.datastacks[0]}
                toolkit = {toolkit}
            />
        </QuadFrame>,
        <QuadFrame
            key = '2'
            quadrant = {this.calcQuadrant(1)}
            handleSwap = {handleSwap}
            split = {this.state.split}
            selectQuadrant = {this.selectQuadrant}
        >
            <Quadrant 
                uid = '2'
                color = '#e8e8e8' 
                datastack = {this.state.datastacks[1]}
                toolkit = {toolkit}
            />
        </QuadFrame>,
        <QuadFrame
            key = '3'
            quadrant = {this.calcQuadrant(2)}
            handleSwap = {handleSwap}
            split = {this.state.split}
            selectQuadrant = {this.selectQuadrant}
        >
            <Quadrant 
                uid = '3'
                color = '#e8e8e8' 
                datastack = {this.state.datastacks[2]}
                toolkit = {toolkit}
            />
        </QuadFrame>,
        <QuadFrame
            key = '4'
            quadrant = {this.calcQuadrant(3)}
            handleSwap = {handleSwap}
            split = {this.state.split}
            selectQuadrant = {this.selectQuadrant}
        >
            <Quadrant 
                uid = '4'
                color = '#e8e8e8' 
                datastack = {this.state.datastacks[3]}
                toolkit = {toolkit}
            />
        </QuadFrame>,
        ]
    }

    render() {
        return (
            <QuadSpaceFrame>
                <QuadToolsStrip currentquad = {this.state.currentquad}
                    takingfocus = {this.takingfocus}
                    split = {this.state.split}
                    changeSplit = {this.changeSplit}
                />
                <QuadBasket><QuantityBadge quantity = {0} style = {{left:'-12px'}} /></QuadBasket>
                <QuadViewport>
                    <QuadPlatform 
                        currentquad = {this.state.currentquad}
                        split = {this.state.split}
                    >
                        {this.quadrants()}
                    </QuadPlatform>
                </QuadViewport>
                <QuadStatusBar status = 'Something Something Something Something Something Something Something Something Something Something Something Something Something Something Something Something Something ' />
            </QuadSpaceFrame>
        )
    }
}

export default QuadspaceController