// quad.controller.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence

'use strict'

import React from 'react'

import QuadToolsStrip from './common/toolsstrip.view'
import QuadNavigationMenu from './quadspace/quadnavigationmenu.view'
import SplitNavigationMenu from './quadspace/splitnavigationmenu.view'
import QuadSpaceFrame from './quadspace/quadspaceframe.view'
import QuadBasket from './quadspace/quadbasket.view'
import QuadViewport from './quadspace/quadviewport.view'
import QuantityBadge from './common/quantitybadge.view'
import QuadStatusBar from './quadspace/quadstatusbar.view'
import Quadrants from './quadrants.controller'
import VerticalDivider from './common/verticaldivider.view'

import { datastacks } from '../../data/datastacks'
import application from '../services/application'

import UserContext from '../services/user.context'

class QuadspaceController extends React.Component<any,any> {

    constructor(props) {
        super(props)
        this.quadrantIdentifiers = this.state.quadrantPositions.map((value) => {
            return (value + 1).toString()
        })
    }

    state = {
        quadrantPositions:[0,1,2,3],
        currentQuadPosition:'topleft',
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

    quadrantIdentifiers

    selectQuad = (quadrantposition) => {
        this.setState({
            currentQuadPosition:quadrantposition,
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

    changeSplitFrom = (toggleIndex) => {
        let newIndex = null
        if (toggleIndex == this.state.split) {
            newIndex = 'none'
        } else {
            newIndex = toggleIndex
        }
        this.changeSplit(newIndex)
    }

    handleSwap = (quadrantPosition,direction) => {

        let { quadrantPositions } = this.state

        let sourcequadindex = this.positions.indexOf(quadrantPosition)

        let targetquadposition = this.quadmap[quadrantPosition][direction]
        let targetquadindex = this.positions.indexOf(targetquadposition)

        let sourcepositionindex = quadrantPositions[sourcequadindex]
        let targetpositionindex = quadrantPositions[targetquadindex]

        // the swap
        quadrantPositions[sourcequadindex] = targetpositionindex
        quadrantPositions[targetquadindex] = sourcepositionindex

        this.setState({
            quadrantPositions
        })

    }

    calcPos = instanceid => {
        return this.state.quadrantPositions.indexOf(instanceid)
    }

    calcQuadrantPosition = (instanceid) => {
        let pos = this.calcPos(instanceid)
        return this.positions[pos]
    }

    selectQuadrant = quadrantPosition => {
        this.setState({
            currentQuadPosition:quadrantPosition,
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

    quadrantcallbacks = {
        handleSwap:this.handleSwap, 
        setItemListener:application.setItemListener, 
        setListListener:application.setListListener, 
        selectQuadrant:this.selectQuadrant, 
        calcQuadrantPosition:this.calcQuadrantPosition,
    }

    quadtoolsstyle = {right:'96px'}

    badgestyle = {left:'-12px'}

    render() {
        return (
            <QuadSpaceFrame>
                <UserContext.Consumer>
                { user => (
                    <QuadToolsStrip 
                        user = {user}
                        childrenposition = 'middle'
                        style = {this.quadtoolsstyle}
                    >
                        <QuadNavigationMenu 
                            currentQuadPosition = {this.state.currentQuadPosition} 
                            split = {this.state.split} 
                            selectQuad = {this.selectQuad} />
                        <VerticalDivider />
                        <SplitNavigationMenu 
                            split = {this.state.split}
                            changeSplitFrom = {this.changeSplitFrom}
                        />
                        <VerticalDivider />
                    </QuadToolsStrip>)
                }
                </UserContext.Consumer>
                <QuadBasket><QuantityBadge quantity = {0} style = {this.badgestyle} /></QuadBasket>
                <QuadViewport>
                    <Quadrants                         
                        quadrantIdentifiers =  {this.quadrantIdentifiers}
                        split = {this.state.split}
                        datastacks = {this.state.datastacks}
                        currentQuadPosition = {this.state.currentQuadPosition}

                        callbacks = {this.quadrantcallbacks}
                    />
                </QuadViewport>
                <QuadStatusBar status = 'prompts' />
            </QuadSpaceFrame>
        )
    }
}

export default QuadspaceController