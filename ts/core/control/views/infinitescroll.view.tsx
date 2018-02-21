// continuousscroll.view.tsx

// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import * as React from 'react'

class InfiniteScroll extends React.Component<any,any> {

    state = {
        children:this.props.startset,
        scrolling:false,
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
            <div className = 'CS_viewport' style = {this.viewportStyle as any} 
                onScroll = {this.onScroll}
            >
                <div className = 'CS_platform' style = {this.platformStyle as any}>
                    <div className = 'CS_list' style = {{}}>
                        { this.state.children }
                    </div>
                </div>
            </div>
        </div>
    }
}

export default InfiniteScroll