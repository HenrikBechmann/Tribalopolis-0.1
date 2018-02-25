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

let data = [
    [
        {
            sessionid:0,
            type:'object',
            tribe:'__owner__',
            id:'henrik',
            profile:{
                tag:'Henrik',
                name:'Henrik Bechmann',
                title:null,
                description:'Creator of Tribalopolis',
                birthdate:'1950-08-23',
                location:'Toronto',
                locationid:'Toronto',
            },
            fields:
            {
                set:{
                    connections:{
                        active:true,
                        count:23,
                        name:'Connections',
                    },
                    roles:{
                        active:true,
                        count:4,
                        name:'Roles',
                    },
                    programs:{
                        active:true,
                        count:5,
                        name:'Programs',
                    },
                    projects:{
                        active:true,
                        count:3,
                        name:'Projects',
                    },
                    tasks:{
                        active:true,
                        count:20,
                        name:'Tasks',
                    },
                    messengers:{
                        active:true,
                        count:3,
                        name:'Messengers',
                    },
                    resources:{
                        active:true,
                        count:64,
                        name:'Resources',
                    },
                    calendar:{
                        active:true,
                        count:67,
                        name:'Calendar',
                    },
                    accounting:{
                        active:true,
                        count:6000,
                        name:'Accounting',
                    },
                },
                order:[
                    'connections',
                    'roles:',
                    'programs',
                    'projects',
                    'tasks',
                    'messengers',
                    'resources',
                    'calendar',
                    'accounting',
                ]
            },
            backlinks:{
                set:{
                },
                order:[
                ]
            }
        },
        // {
        //     sessionid:1,
        //     type:'object',
        //     tribe:'__owner__',
        //     id:'paul',
        //     profile:{
        //         tag:'Paul',
        //         name:'Paul Bliss',
        //         title:null,
        //         description:'User of Tribalopolis',
        //         birthdate:'1980-08-23',
        //         location:'Toronto',
        //         locationid:'Toronto',
        //     },
        //     fields:
        //     {
        //         set:{
        //             connections:{
        //                 active:true,
        //                 count:23,
        //                 name:'Connections',
        //             },
        //             roles:{
        //                 active:true,
        //                 count:4,
        //                 name:'Roles',
        //             },
        //             programs:{
        //                 active:true,
        //                 count:5,
        //                 name:'Programs',
        //             },
        //             projects:{
        //                 active:true,
        //                 count:3,
        //                 name:'Projects',
        //             },
        //             tasks:{
        //                 active:true,
        //                 count:20,
        //                 name:'Tasks',
        //             },
        //             messengers:{
        //                 active:true,
        //                 count:3,
        //                 name:'Messengers',
        //             },
        //             resources:{
        //                 active:true,
        //                 count:64,
        //                 name:'Resources',
        //             },
        //             calendar:{
        //                 active:true,
        //                 count:67,
        //                 name:'Calendar',
        //             },
        //             accounting:{
        //                 active:true,
        //                 count:6000,
        //                 name:'Accounting',
        //             },
        //         },
        //         order:[
        //             'connections',
        //             'roles:',
        //             'programs',
        //             'projects',
        //             'tasks',
        //             'messengers',
        //             'resources',
        //             'calendar',
        //             'accounting',
        //         ]
        //     },
        //     backlinks:{
        //         set:{
        //         },
        //         order:[
        //         ]
        //     }
        // }
    ],
    null,
    null,
    null,
]

class QuadspaceController extends React.Component<any,any> {

    state = {
        quadrantpositions:[0,1,2,3],
        currentquad:'topleft',
        split:'none',
        data:data,
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
            },500)
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
        console.log('quadselection',quadrant)
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

    quadrants = () => [
        <Quadrant 
            key = '1'
            sessionid = {0}
            handleswap = {this.handleSwap}
            quadrant = {this.calcQuadrant(0)}
            split = {this.state.split}
            quadselection = {this.quadselection}
            color = 'lightgreen' 
            title = 'first'
            badgequantity = {0}
            data = {this.state.data[0]}
        />,
        <Quadrant 
            key = '2'
            sessionid = {1}
            handleswap = {this.handleSwap}
            quadrant = {this.calcQuadrant(1)}
            split = {this.state.split}
            quadselection = {this.quadselection}
            color = 'mistyrose' 
            title = "second" 
            badgequantity = {0}
            data = {this.state.data[1]}
        />,
        <Quadrant 
            key = '3'
            sessionid = {2}
            handleswap = {this.handleSwap}
            quadrant = {this.calcQuadrant(2)}
            split = {this.state.split}
            quadselection = {this.quadselection}
            color = 'lightblue' 
            title = "third" 
            badgequantity = {0}
            data = {this.state.data[2]}
        />,
        <Quadrant 
            key = '4'
            sessionid = {3}
            handleswap = {this.handleSwap}
            quadrant = {this.calcQuadrant(3)}
            split = {this.state.split}
            quadselection = {this.quadselection}
            color = 'papayawhip' 
            title = "fourth" 
            badgequantity = {0}
            data = {this.state.data[3]}
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
                <QuadBasket><QuadBadge quantity = {0} style = {{left:'-12px'}} /></QuadBasket>
                <QuadViewport>
                    <QuadPlatform 
                        currentquad = {this.state.currentquad}
                        split = {this.state.split}
                    >
                        {this.quadrants()}
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