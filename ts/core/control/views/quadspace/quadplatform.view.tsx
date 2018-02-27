// quadplatform.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import * as React from 'react'

class QuadPlatform extends React.Component<any,any> {

    state = {
        currentquad: this.props.currentquad,
        split:this.props.split,
    }

    positions = null

    dimensions = null

    element = null

    componentWillMount() {

        this.calculateDimensions(this.state.split)
        this.calculatePosition(this.state.currentquad)

    }

    changeCurrentQuad = nextProps => {
        let element = this.element
        // set top left for animation

        let nextquad = nextProps.currentquad

        this.calculateTransitionPosition(this.state.currentquad)
        // console.log('BASE changing from quad',this.state.currentquad,this.positions)

        this.forceUpdate(() =>{

            setTimeout(()=> {

                // prepare for animation transition
                this.calculateTransitionPosition(nextquad)
                // console.log('TRANSITION changing to quad',nextquad,this.positions)

                this.setState({

                    currentquad:nextquad,

                },() => { // restore settings to be able to respond to user resize of window

                        setTimeout(()=> {

                            this.calculatePosition(nextquad)

                            this.setState({
                                currentquad:nextquad,
                            },
                            ()=>{
                                // console.log('DONE changing quad',nextquad,this.positions)
                            })

                        },600)

                    }
                )
            },50)
        })
    }

    componentWillReceiveProps(nextProps) {

        // should be either one or the other

        if (nextProps.split != this.state.split) {
            this.calculateDimensions(nextProps.split)
            this.setState({
                split:nextProps.split
            } //,

            // () => {
            //     setTimeout(()=> {
            //         this.element.style.display = 'none'
            //         let a = this.element.style.offsetHeight
            //         this.element.style.display = 'block'
            //     },2000)
            // }

            )
        }

        if (nextProps.currentquad != this.state.currentquad) {
            setTimeout(() => {
                this.changeCurrentQuad(nextProps)
            })
        }
    }

    calculateTransitionPosition = quadrant => {

        let {split} = this.state
        let top = null
        let left = null
        let right = 'auto'
        let bottom = 'auto'
        switch (quadrant) {
            case 'topleft': {
                switch (split) {
                    case 'none':
                        top = '0'
                        left = '0'
                        break
                    case 'horizontal':
                        top = '0'
                        left = '0'
                        break
                    case 'vertical':
                        top = '0'
                        left = '0'
                        break
                    case 'matrix':
                        top = '0'
                        left = '0'
                        break
                }
                break
            }
            case 'topright': {
                switch (split) {
                    case 'none':
                        top = '0'
                        left = -this.element.parentElement.offsetWidth + 'px' 
                        break
                    case 'horizontal':
                        top = '0'
                        left = '0'
                        break
                    case 'vertical':
                        top = '0'
                        left = -this.element.parentElement.offsetWidth + 'px' 
                        break
                    case 'matrix':
                        top = '0'
                        left = '0'
                        break
                }
                break
            }
            case 'bottomleft': {
                switch (split) {
                    case 'none':
                        top = -this.element.parentElement.offsetHeight + 'px' 
                        left = '0'
                        break
                    case 'horizontal':
                        top = -this.element.parentElement.offsetHeight + 'px' 
                        left = '0'
                        break
                    case 'vertical':
                        top = '0'
                        left = '0'
                        break
                    case 'matrix':
                        top = '0'
                        left = '0'
                        break
                }
                break
            }
            case 'bottomright': {
                switch (split) {
                    case 'none':
                        top = -this.element.parentElement.clientHeight + 'px' //offsetHeight + 'px'
                        left = -this.element.parentElement.clientWidth + 'px' //offsetWidth + 'px'
                        break
                    case 'horizontal':
                        top = -this.element.parentElement.clientHeight + 'px' //offsetHeight + 'px'
                        left = '0'
                        break
                    case 'vertical':
                        top = '0'
                        left = -this.element.parentElement.clientWidth + 'px' //offsetWidth + 'px'
                        break
                    case 'matrix':
                        top = '0'
                        left = '0'
                        break
                }
                break
            }
        }
        this.positions = {
            top,
            left,
            right,
            bottom,
        }

    }

    calculatePosition = (quadrant) => {
        let top = 'auto'
        let left = 'auto'
        let right = 'auto'
        let bottom = 'auto'
        switch (quadrant) {
            case 'topleft': {
                top = '0'
                left = '0'
                break
            }
            case 'topright': {
                top = '0'
                right = '0'
                break
            }
            case 'bottomleft': {
                bottom = '0'
                left = '0'
                break
            }
            case 'bottomright': {
                bottom = '0'
                right = '0'
                break
            }
        }
        this.positions = {
            top,
            left,
            right,
            bottom,
        }
    }

    calculateDimensions = (split) => {
        let width = null
        let height = null
        switch (split) {
            case 'none':{
                width = '200%'
                height = '200%'
                break
            }
            case 'horizontal': {
                width = '100%'
                height = '200%'
                break
            }
            case 'vertical': {
                width = '200%'
                height = '100%'
                break
            }
            case 'matrix': {
                width = '100%'
                height = '100%'
                break
            }
        }

        this.dimensions = {
            width,
            height,
        }

    }

    render() {
        let { left, right, top, bottom } = this.positions

        let {width, height} = this.dimensions

        // console.log('render quadplatform',this.positions,this.dimensions)

        return (
            <div id = "quadplatform" style={
                {
                    position:'absolute',
                    width,
                    height,
                    top,
                    left,
                    bottom,
                    right,
                    transition: 'top .5s ease,left .5s ease, width .5s ease, height .5s ease'
                }
            } 
            ref = {el => {
                this.element = el
            }}
            >
                { this.props.children }
            </div>        
        )
    }
}

export default QuadPlatform