// quad.controller.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence

'use strict'

import * as React from 'react'

// import { connect } from 'react-redux'

import QuadToolsStrip from './quadspace/quadtoolsstrip.view'
import QuadSpaceFrame from './quadspace/quadspaceframe.view'
import QuadBasket from './quadspace/quadbasket.view'
import QuadViewport from './quadspace/quadviewport.view'
// import QuadDiamond from './quadspace/quaddiamond.view'
import QuantityBadge from './common/quantitybadge.view'
import QuadStatusBar from './quadspace/quadstatusbar.view'
import Quadrants from './quadrants.controller'

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

    quadrantidentifiers

    componentWillMount() {
        this.quadrantidentifiers = this.state.quadrantpositions.map((value) => {
            return (value + 1).toString()
        })
    }

    selectQuad = (quadrantname) => {
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

    calcPos = sessionid => {
        return this.state.quadrantpositions.indexOf(sessionid)
    }

    calcQuadrant = (sessionid) => {
        let pos = this.calcPos(sessionid)
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

    // TODO: the following 3 data functions should be in the application service

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

    quadranttoolkit = {
        handleSwap:this.handleSwap, 
        getDataItem:this.getDataItem, 
        getListItem:this.getListItem, 
        getTypeItem:this.getTypeItem, 
        selectQuadrant:this.selectQuadrant, 
        calcQuadrant:this.calcQuadrant,
    }

    toolsstriptoolkit = {
        selectQuad:this.selectQuad,
        changeSplit:this.changeSplit,
    }

    render() {
        return (
            <QuadSpaceFrame>
                <QuadToolsStrip currentquad = {this.state.currentquad}
                    toolkit = {this.toolsstriptoolkit}
                    split = {this.state.split}
                />
                <QuadBasket><QuantityBadge quantity = {0} style = {{left:'-12px'}} /></QuadBasket>
                <QuadViewport>
                    <Quadrants 
                        toolkit = {this.quadranttoolkit}
                        quadrantidentifiers =  {this.quadrantidentifiers}
                        split = {this.state.split}
                        datastacks = {this.state.datastacks}
                        currentquad = {this.state.currentquad}
                    />
                </QuadViewport>
                <QuadStatusBar status = 'Something Something Something Something Something Something Something Something Something Something Something Something Something Something Something Something Something ' />
            </QuadSpaceFrame>
        )
    }
}

export default QuadspaceController