// quadplatform.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import * as React from 'react'

class QuadPlatform extends React.Component<any,any> {

    state = {
        currentquad: this.props.currentquad,
        top:'auto',
        left:'auto',
        bottom:'auto',
        right:'auto',
    }

    element = null

    nextquad = this.props.currentquad

    componentWillReceiveProps(nextProps) {
        if (nextProps.currentquad != this.state.currentquad) {
            this.nextquad = nextProps.currentquad
            let top = this.element.offsetTop + 'px'
            let left = this.element.offsetLeft + 'px'
            let bottom = 'auto'
            let right = 'auto'
            // let right = (this.element.parentElement.offsetWidth + this.element.offsetLeft) + 'px'
            // let bottom = (this.element.parentElement.offsetHeight + this.element.offsetTop) + 'px'
            console.log('settings on will receive props',top,left, bottom, right)
            this.setState({
                top,
                left,
                bottom,
                right,
            })
        }
    }

    componentDidUpdate() {
        let nextquad = this.nextquad
        if (nextquad != this.state.currentquad) {
            let currentquad = nextquad
            let top = 'auto'
            let left = 'auto'
            let right = 'auto'
            let bottom = 'auto'
            switch (currentquad) {
                case 'topleft': {
                    top = '0'
                    left = '0'
                    break
                }
                case 'topright': {
                    top = '0'
                    left = -this.element.parentElement.offsetWidth + 'px'
                    // right = '0'
                    break
                }
                case 'bottomleft': {
                    // bottom = '0'
                    top = -this.element.parentElement.offsetHeight + 'px'
                    left = '0'
                    break
                }
                case 'bottomright': {
                    top = -this.element.parentElement.offsetHeight + 'px'
                    left = -this.element.parentElement.offsetWidth + 'px'
                    // bottom = '0'
                    // right = '0'
                    break
                }
            }
            setTimeout(()=> {
                this.setState({
                    currentquad:nextquad,
                    top,
                    left,
                    right,
                    bottom,
                })
            })
        }
    }

    render() {
    let { currentquad, left, right, top, bottom } = this.state
    console.log('platform state before render',this.state)

    return (
        <div id = "quadplatform" style={
            {
                position:'absolute',
                width:'200%',
                height:'200%',
                top,
                left,
                bottom,
                right,
                transition: 'top .5s ease,left .5s ease'
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