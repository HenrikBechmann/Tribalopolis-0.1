// continuousscroll.view.tsx

// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import * as React from 'react'
import ScrollControlsView from './scrollcontrols.view'

class InfiniteScroll extends React.Component<any,any> {

    constructor(props) {
        super(props)
        this.state = {
            items:this.props.items,
            scrolling:false,
            scroller:null,
            continuous:!!props.continuous
        }
    }

    state = null

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
        this.setState({
            scroller:this.scroller
        })
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

    viewportFrameStyle:React.CSSProperties = {
        position:'absolute',
        top:'calc(25px + 2%)',
        left:'2%',
        bottom:'2%',
        right:'2%',
        borderRadius:'8px',
        overflow:'hidden',
    }

    viewportStyle:React.CSSProperties = { // borderRadius on scroller breaks scrollbar
        width:'100%',
        height:'100%',
        overflowX:'auto',
        display:'flex',
        flexWrap:'nowrap',
        backgroundColor:'silver',
    }

    platformStyle:React.CSSProperties = {
        position:'relative',
        display:'flex',
        height:'100%',
        flexWrap:'nowrap',
        boxSizing:'border-box',
        margin:'0 auto 0 auto',
    }

    listStyle:React.CSSProperties = {
        display:'flex',
        position:'relative',
        flexWrap:'nowrap',
        height:'100%',
        marginLeft:'30px',
        boxSizing:'border-box',
        borderRadius:'6px',
        padding:'2% 0 0 0',
    }

    render () {
        return <div className = 'CS_viewportframe' style = {this.viewportFrameStyle} >
            <ScrollControlsView id='scrollcontrolsview' 
                scroller = {this.state.scroller} 
                style = {{width:'100%',height:'100%',position:'relative'}}
            >
                <div className = 'CS_viewport' style = {this.viewportStyle} 
                    onScroll = {this.onScroll}
                    ref = {el => {
                        this.scroller = el
                    }}
                >
                    <div className = 'CS_platform' style = {this.platformStyle}>
                        <div className = 'CS_list' style = {this.listStyle}>
                            { this.state.items }
                        </div>
                    </div>
                </div>
            </ScrollControlsView>
        </div>
    }
}

export default InfiniteScroll

