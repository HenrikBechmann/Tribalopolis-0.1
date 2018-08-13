// continuousscroll.view.tsx

// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import * as React from 'react'
import ScrollControlsView from './scrollcontrols.view'

class InfiniteScrollBase extends React.Component<any,any> {

    constructor(props) {
        super(props)
        this.state = {
            items:this.props.items,
            scrolling:false,
            scroller:null,
            continuous:!!props.continuous
        }
        this.scroller = props.forwardedRef
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

    scroller

    componentDidMount() {
        this.setState({
            scroller:this.scroller.current
        })
    }

    // determine change in headadd or tailadd props
    // objects {uid:string,item:ReactElement}
    componentWillReceiveProps(nextProps) {
        if (nextProps.items != this.state.items) {
            // console.log('changed items',nextProps.items)
            this.setState({
                items:nextProps.items
            })
        }
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
        padding:'6px 0 0 0',
    }

    render () {
        let viewportStyle:React.CSSProperties = { // borderRadius on scroller breaks scrollbar
            width:'100%',
            height:'100%',
            overflowX:'auto',
            display:'flex',
            flexWrap:'nowrap',
            backgroundColor:'#e8e8e8',
            border: '1px solid gray',
            boxSizing: 'border-box',
            borderRadius: '8px',
            position:'relative',
        }
        if (this.state.items.length == 1) {
            viewportStyle.backgroundColor = 'lightblue'
        } else {
            viewportStyle.backgroundColor = '#e8e8e8'
        }
        return <div className = 'CS_viewportframe' style = {this.viewportFrameStyle} >
            <ScrollControlsView uid='scrollcontrolsview' 
                scroller = {this.state.scroller} 
                style = {{width:'100%',height:'100%',position:'relative'}}
            >
                <div className = 'CS_viewport' style = {viewportStyle} 
                    ref = {this.scroller}
                    data-marker = 'boxlist-scrollbox'
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

const InfiniteScroll = React.forwardRef((props:any,ref:any) => {
    return <InfiniteScrollBase {...props} forwardedRef = {ref} />
})

export default InfiniteScroll

