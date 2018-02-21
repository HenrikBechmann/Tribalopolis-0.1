// quadrant.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import * as React from 'react'

import QuadOrigin from './quadorigin.view'
import QuadTitleBar from './quadtitlebar.view'
import QuadStatusBar from './quadstatusbar.view'
import QuadBadge from './quadbadge.view'
import InfiniteScroll from './infinitescroll.view'

class Quadrant extends React.Component<any,any>  {

    constructor(props) {
        super(props)
        this.state.quadrant = this.props.quadrant
    }
    
    state = {
        infocus:false,
        quadrant:null,
    }

    componentWillMount() {
        this.props.binding(this.props.sessionid,this)
    }

    onfocusin = () => {
        if (!this.state.infocus) {
            this.props.takingfocus(this.props.sessionid,this.state.quadrant)
            this.setState({
                infocus:true,
            })
        }
    }

    onfocusout = () => {
        if (this.state.infocus) {
            this.setState({
                infocus:false,
            })
        }
    }

    onclick = () => {
        if (!this.state.infocus) {
            this.element.focus()
        }
    }

    element = null

    render() {
        let { quadrant, color } = this.props
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
            }
            case "bottomright": {
                bottom = 0
                right = 0
            }
        } 
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
                        outline:'none',
                    }

                }
                ref = {(el) => {
                    this.element = el
                }}
                tabIndex = {0}
                onFocus = {this.onfocusin}
                onBlur = {this.onfocusout}
                onClick = {this.onclick}
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
                    <QuadTitleBar title = {this.props.title} infocus = {this.state.infocus}/>
                    <QuadOrigin><QuadBadge quantity = {this.props.badgequantity} /></QuadOrigin>
                    <InfiniteScroll />
                </div>
            </div>
        )
    }
}

export default Quadrant