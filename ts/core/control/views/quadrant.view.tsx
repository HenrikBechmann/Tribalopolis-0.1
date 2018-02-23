// quadrant.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import * as React from 'react'

import QuadOrigin from './quadorigin.view'
import QuadTitleBar from './quadtitlebar.view'
import QuadStatusBar from './quadstatusbar.view'
import QuadBadge from './quadbadge.view'
import InfiniteScroll from './infinitescroll.view'
import SwapMenu from './swapmenu.view'

class Quadrant extends React.Component<any,any>  {

    state = {
        quadrant:this.props.quadrant,
    }

    sessionid = this.props.sessionid

    componentWillMount() {
        this.calculatePosition(this.state.quadrant)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.quadrant != this.state.quadrant) {

            let self = this
            this.calculateTransitionPosition(this.state.quadrant)
            this.forceUpdate(() => {
                this.calculateTransitionPosition(nextProps.quadrant)
                this.setState({
                    quadrant:nextProps.quadrant
                },

                    () => {
                        setTimeout(() => {
                            self.calculatePosition(this.state.quadrant)
                            self.forceUpdate()
                        },600)
                    }

                )
            })
        }
    }

    calculateTransitionPosition = (quadrant) => {
        let top:any = 'auto'
        let left:any = 'auto'
        let bottom:any = 'auto'
        let right:any = 'auto'
        let element = this.element
        switch (quadrant) {
            case "topleft": {
                top = 0
                left = 0
                break;
            }
            case "topright": {
                top = 0
                left = element.parentElement.offsetWidth/2
                break;
            }
            case "bottomleft": {
                top = element.parentElement.offsetHeight/2
                left = 0
                break;
            }
            case "bottomright": {
                top = element.parentElement.offsetHeight/2
                left = element.parentElement.offsetWidth/2
                break;
            }
        }
        this.position = {
            top,
            left,
            bottom,
            right,
        }       
    }

    calculatePosition = (quadrant) => {
        let top:any = 'auto'
        let left:any = 'auto'
        let bottom:any = 'auto'
        let right:any = 'auto'
        switch (quadrant) {
            case "topleft": {
                top = 0
                left = 0
                break;
            }
            case "topright": {
                top = 0
                right = 0
                break;
            }
            case "bottomleft": {
                bottom = 0
                left = 0
                break;
            }
            case "bottomright": {
                bottom = 0
                right = 0
                break;
            }
        }
        this.position = {
            top,
            left,
            bottom,
            right,
        }       
    }

    position = null

    element = null

    render() {
        let { color } = this.props
        let { quadrant } = this.state
        let {top, left, bottom, right} = this.position
        return (
            <div 
                style = {
                    {
                        position:'absolute',
                        boxSizing:'border-box',
                        width:'50%',
                        height:'50%',
                        padding:'3px',
                        top,
                        left,
                        bottom,
                        right,
                        border:'1px solid transparent',
                        transition:'all .5s ease'
                    }

                }
                ref = {(element) => {
                    this.element = element
                }}
            >
                <div style = {
                    {
                        boxSizing: 'border-box',
                        border: '3px outset gray',
                        position:'relative',
                        backgroundColor:color,
                        borderRadius:'8px',
                        width:'100%',
                        height:'100%',
                    }
                } >
                    <SwapMenu quadrant = {this.state.quadrant} handleswap = {this.props.handleswap}/>
                    <QuadTitleBar title = {this.props.title}/>
                    <QuadOrigin><QuadBadge quantity = {this.props.badgequantity} /></QuadOrigin>
                    <InfiniteScroll />
                </div>
            </div>
        )
    }
}

export default Quadrant