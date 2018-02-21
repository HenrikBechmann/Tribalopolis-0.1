// quadplatform.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import * as React from 'react'

class QuadPlatform extends React.Component<any,any> {

    state = {
        currentquad: this.props.currentquad,
    }

    element = null

    componentWillReceiveProps(nextProps) {
        if (nextProps.currentquad != this.state.currentquad) {
            this.setState({
                currentquad:nextProps.currentquad
            })
        }
    }

    render() {
    let currentquad = this.state.currentquad
    console.log('platform currentquad',currentquad)
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
                transition: 'top 1s ease-in,left 1s ease-in,bottom 1s ease-in,right 1s ease-in'
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