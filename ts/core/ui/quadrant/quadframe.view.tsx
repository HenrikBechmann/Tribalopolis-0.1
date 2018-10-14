// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
// quadframe.view.tsx

'use strict'

import React from 'react'

import SwapMenu from './quadswapmenu.view'
import QuadSelector from './quadselector.view'

class QuadFrame extends React.Component<any,any>  {

    constructor(props) {
        super(props)
        this.quadframeelement = React.createRef()
        this.calculatePosition(this.state.quadrantPosition)
    }

    state = {
        quadrantPosition:this.props.quadrantPosition,
    }
    // quad css position
    position = null
    quadframeelement

    updatingposition = false

    componentDidUpdate() {
        if ((this.props.quadrantPosition != this.state.quadrantPosition) && !this.updatingposition) {
            this.updatingposition = true
            let self = this
            self.calculateTransitionPosition(self.state.quadrantPosition)

            self.forceUpdate(() => {
                setTimeout(()=>{// give time for styles to apply
                    self.calculateTransitionPosition(this.props.quadrantPosition)
                    self.setState({
                        quadrantPosition:this.props.quadrantPosition
                    },

                        () => {
                            setTimeout(() => { // give time for animation
                                self.calculatePosition(self.state.quadrantPosition)
                                self.forceUpdate(() => {
                                    this.updatingposition = false
                                })
                            },600)
                        }

                    )
                },300)
            })
        }
    }

/********************************************************
------------------[ position quadrantPosition ]------------------
*********************************************************/

    calculateTransitionPosition = (quadrantPosition) => {
        let top:any = 'auto'
        let left:any = 'auto'
        let bottom:any = 'auto'
        let right:any = 'auto'
        let quadframeelement = this.quadframeelement.current
        switch (quadrantPosition) {
            case "topleft": {
                top = 0
                left = 0
                break;
            }
            case "topright": {
                top = 0
                left = (quadframeelement.parentElement.offsetWidth/2) + 'px' 
                break;
            }
            case "bottomleft": {
                top = (quadframeelement.parentElement.offsetHeight/2) + 'px' 
                left = 0
                break;
            }
            case "bottomright": {
                top = (quadframeelement.parentElement.offsetHeight /2) + 'px' 
                left = (quadframeelement.parentElement.offsetWidth /2) + 'px' 
                break;
            }
        }
        // console.log('calculateTransitionPosition',quadrantPosition,top,right,bottom,left)
        this.position = {
            top,
            left,
            bottom,
            right,
        }       
    }

    calculatePosition = (quadrantPosition) => {
        let top:any = 'auto'
        let left:any = 'auto'
        let bottom:any = 'auto'
        let right:any = 'auto'
        switch (quadrantPosition) {
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
        // console.log('calculatePosition',quadrantPosition, top, right, bottom,  left)
        this.position = {
            top,
            left,
            bottom,
            right,
        }       
    }

    render() {

        let {top, left, bottom, right} = this.position

        let quadframestyle:React.CSSProperties = {
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

        return (
            <div 
                style = {quadframestyle}
                ref = {this.quadframeelement}
            >
                <SwapMenu 
                    quadrantPosition = {this.state.quadrantPosition} 
                    handleSwap = {this.props.callbacks.handleSwap}
                />
                {this.props.children}
                <QuadSelector 
                    quadrantPosition = {this.state.quadrantPosition} 
                    split = {this.props.split} 
                    selectQuadrant = {this.props.callbacks.selectQuadrant}
                />
            </div>
        )
    }

}

export default QuadFrame