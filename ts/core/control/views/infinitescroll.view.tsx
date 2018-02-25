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

    viewportFrameStyle = {
        position:'absolute',
        top:'calc(25px + 2%)',
        left:'2%',
        bottom:'2%',
        right:'2%',
        borderRadius:'8px',
        overflow:'hidden',
    }

    viewportStyle = { // borderRadius on scroller breaks scrollbar
        width:'100%',
        height:'100%',
        overflowX:'auto',
        display:'flex',
        flexFlow:'row',
        flexWrap:'nowrap',
    }

    platformStyle = {
        display:'flex',
        height:'100%',
        minWidth:'100%',
        // flexFlow:'row',
        flexWrap:'nowrap',
        boxSizing:'border-box',
        backgroundColor:'white',
    }

    listStyle = {
        display:'flex',
        // flexFlow:'row',
        flexWrap:'nowrap',
        height:'100%',
        marginLeft:'30px',
        // padding:'1%',
        boxSizing:'border-box',
        // whiteSpace:'nowrap',
        borderRadius:'6px',
        backgroundColor:'white',
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
                        <div className = 'CS_list' style = {this.listStyle as any}>
                            { this.state.items }
                        </div>
                    </div>
                </div>
            </ScrollControlsView>
        </div>
    }
}

export default InfiniteScroll

