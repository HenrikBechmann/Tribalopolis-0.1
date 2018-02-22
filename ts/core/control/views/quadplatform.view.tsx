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
            this.setState({
                top:this.element.offsetTop + 'px',
                left:this.element.offsetLeft + 'px',
                right:(this.element.parentElement.offsetWidth + this.element.offsetLeft) + 'px',
                bottom:(this.element.parentElement.offsetHeight + this.element.offsetTop) + 'px',
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
    console.log('platform state',this.state)

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
                transition: 'all 1s ease'
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