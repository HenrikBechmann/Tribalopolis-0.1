// quad.controller.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import * as React from 'react'

import { connect } from 'react-redux'

import QuadToolsStrip from './views/quadtoolsstrip.view'
import QuadFrame from './views/quadframe.view'
import QuadBasket from './views/quadbasket.view'
import QuadViewport from './views/quadviewport.view'
import QuadPlatform from './views/quadplatform.view'
import Quadrant from './views/quadrant.view'
import QuadDiamond from './views/quaddiamond.view'
import QuadBadge from './views/quadbadge.view'
import QuadStatusBar from './views/quadstatusbar.view'

class QuadspaceController extends React.Component<any,any> {

    state = {
        quadrantindexes:[0,1,2,3],
        currentquad:null,
    }

    // quadrants can be re-arranged; quadrant attribute needs to be updated

    positions = [
        'topleft',
        'topright',
        'bottomleft',
        'bottomright',
    ]

    quadbindings = [null,null,null,null]

    binding = (sessionid,quad) => {
        this.quadbindings[sessionid] = quad
    }

    takingfocus = (sessionid, quadrantname) => {
        this.setState({
            currentquad:quadrantname,
        })
    }

    componentDidMount() {
        this.forceUpdate()
        console.log('quads after mount',this.quadbindings)
    }

    render() {
        let quadrantindexes = this.state.quadrantindexes
        return (
            <QuadFrame>
                <QuadToolsStrip bindings = {this.quadbindings} currentquad = {this.state.currentquad}/>
                <QuadBasket><QuadBadge quantity = {3000} style = {{left:'-12px'}} /></QuadBasket>
                <QuadViewport>
                    <QuadPlatform>
                        <Quadrant 
                            key = '1'
                            sessionid = {0}
                            binding = {this.binding}
                            quadrant = {this.positions[quadrantindexes[0]]}
                            color = 'lightgreen' 
                            title = 'first'
                            takingfocus = {this.takingfocus}
                            badgequantity = {500}
                        />
                        <Quadrant 
                            key = '2'
                            sessionid = {1}
                            binding = {this.binding}
                            quadrant = {this.positions[quadrantindexes[1]]}
                            color = 'mistyrose' 
                            title = "second" 
                            takingfocus = {this.takingfocus}
                            badgequantity = {0}
                        />
                        <Quadrant 
                            key = '3'
                            sessionid = {2}
                            binding = {this.binding}
                            quadrant = {this.positions[quadrantindexes[2]]}
                            color = 'lightblue' 
                            title = "third" 
                            takingfocus = {this.takingfocus}
                            badgequantity = {12}
                        />
                        <Quadrant 
                            key = '4'
                            sessionid = {3}
                            binding = {this.binding}
                            quadrant = {this.positions[quadrantindexes[3]]}
                            color = 'papayawhip' 
                            title = "fourth" 
                            takingfocus = {this.takingfocus}
                            badgequantity = {0}
                        />
                        <QuadDiamond />
                    </QuadPlatform>
                </QuadViewport>
                <QuadStatusBar status = 'Something' />
            </QuadFrame>
        )
    }
}

let mapStateToProps = state => {
    let { resources } = state
    return { 
        resources,
    }
}

export default connect(mapStateToProps)(QuadspaceController)