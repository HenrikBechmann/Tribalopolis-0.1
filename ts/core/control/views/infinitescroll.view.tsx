// continuousscroll.view.tsx

// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import * as React from 'react'
import ScrollControlsView from './scrollcontrols.view'

class InfiniteScroll extends React.Component<any,any> {

    state = {
        children:this.props.startset,
        scrolling:false,
        scroller:null,
    }

    orientation = this.props.orientation || 'vertical'
    buffersize = this.props.buffersize || 5
    headRequestCallback = this.props.headRequest // (count)
    tailRequestCallback = this.props.tailRequest // (count)
    headRemovedCallback = this.props.headRemoved // (count)
    tailRemovedCallback = this.props.tailRemoved // (count)
    noscroll = !!this.props.noscroll

    direction = null // 'back' || 'forward'

    headaddprop = null
    tailaddprop = null

    scroller = null

    componentDidMount() {
        // setTimeout(()=>{
            this.setState({
                scroller:this.scroller
            })
        // },500) // substantial timeout required to give scroll client time to right-size
    }

    // determine change in headadd or tailadd props
    // objects {id:string,item:ReactElement}
    componentWillReceiveProps(nextProps) {

    }

    // TODO turn off parent and sibling scrolling
    onScroll = (e) => {

    }

    setScrollOff = () => {

    } 

    headRequest = () => {

    }

    tailRequest = () => {

    }

    headAdd = list => {

    }

    headRemove = count => {
        
    }

    tailAdd = list => {

    }

    tailRemove = count => {
        
    }

    viewportFrameStyle = {
        position:'absolute',
        top:'50px',
        left:'25px',
        bottom:'25px',
        right:'25px',
        borderRadius:'8px',
        overflow:'hidden',
    }

    viewportStyle = { // borderRadius on scroller breaks scrollbar
        width:'100%',
        height:'100%',
        overflowX:'auto',
    }

    platformStyle = {
        backgroundColor:'white',
        height:'100%',
        width:'200%',
    }

    render () {
        return <div className = 'CS_viewportframe' style = {this.viewportFrameStyle as any} >
            <ScrollControlsView id='scrollcontrolsview' 
                scroller = {this.state.scroller} 
                style = {{width:'100%',height:'100%',position:'relative'}}
            >
                <div className = 'CS_viewport' style = {this.viewportStyle as any} 
                    onScroll = {this.onScroll}
                    ref = {el => {
                        this.scroller = el
                    }}
                >
                    <div className = 'CS_platform' style = {this.platformStyle as any}>
                        <div className = 'CS_list' style = {{}}>
                            { this.state.children }
                        </div>
                    </div>
                </div>
            </ScrollControlsView>
        </div>
    }
}

export default InfiniteScroll