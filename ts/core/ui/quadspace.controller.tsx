// quad.controller.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence

'use strict'

import * as React from 'react'

// import { connect } from 'react-redux'

import QuadToolsStrip from './views/quadspace/quadtoolsstrip.view'
import QuadFrame from './views/quadspace/quadframe.view'
import QuadBasket from './views/quadspace/quadbasket.view'
import QuadViewport from './views/quadspace/quadviewport.view'
import QuadPlatform from './views/quadspace/quadplatform.view'
import Quadrant from './quadrant.controller'
import QuadDiamond from './views/quadspace/quaddiamond.view'
import QuantityBadge from './views/common/quantitybadge.view'
import QuadStatusBar from './views/quadspace/quadstatusbar.view'

import {lists, links, nodes, schemes, stacks} from '../../data/repositories'

class QuadspaceController extends React.Component<any,any> {

    state = {
        quadrantpositions:[0,1,2,3],
        currentquad:'topleft',
        split:'none',
        stacks,
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

    quadselection = quadrant => {
        // console.log('quadselection',quadrant)
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

    getNode = (ref) => {
        return nodes[ref.id]
    }

    getListItem = (ref) => {
        return lists[ref.id]
    }

    quadrants = () => [
        <Quadrant 
            key = '1'
            sessionid = {0}
            handleswap = {this.handleSwap}
            quadrant = {this.calcQuadrant(0)}
            split = {this.state.split}
            quadselection = {this.quadselection}
            color = '#e8e8e8' 
            title = 'first first first first first first first first first first first first first first first first first first first first first first first first first first first first first first first first first '
            badgequantity = {0}
            datastack = {this.state.stacks[0]}
            getNode = {this.getNode}
            getListItem = {this.getListItem}
        />,
        <Quadrant 
            key = '2'
            sessionid = {1}
            handleswap = {this.handleSwap}
            quadrant = {this.calcQuadrant(1)}
            split = {this.state.split}
            quadselection = {this.quadselection}
            color = '#e8e8e8' 
            title = "second" 
            badgequantity = {0}
            datastack = {this.state.stacks[1]}
            getNode = {this.getNode}
            getListItem = {this.getListItem}
        />,
        <Quadrant 
            key = '3'
            sessionid = {2}
            handleswap = {this.handleSwap}
            quadrant = {this.calcQuadrant(2)}
            split = {this.state.split}
            quadselection = {this.quadselection}
            color = '#e8e8e8' 
            title = "third" 
            badgequantity = {0}
            datastack = {this.state.stacks[2]}
            getNode = {this.getNode}
            getListItem = {this.getListItem}
        />,
        <Quadrant 
            key = '4'
            sessionid = {3}
            handleswap = {this.handleSwap}
            quadrant = {this.calcQuadrant(3)}
            split = {this.state.split}
            quadselection = {this.quadselection}
            color = '#e8e8e8' 
            title = "fourth" 
            badgequantity = {0}
            datastack = {this.state.stacks[3]}
            getNode = {this.getNode}
            getListItem = {this.getListItem}
        />,
    ]

    render() {
        return (
            <QuadFrame>
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
            </QuadFrame>
        )
    }
}

export default QuadspaceController