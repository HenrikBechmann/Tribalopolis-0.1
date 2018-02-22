// continuousscroll.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
import ScrollControlsView from './scrollcontrols.view';
class InfiniteScroll extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            children: this.props.startset,
            scrolling: false,
            scroller: null,
        };
        this.orientation = this.props.orientation || 'vertical';
        this.buffersize = this.props.buffersize || 5;
        this.headRequestCallback = this.props.headRequest; // (count)
        this.tailRequestCallback = this.props.tailRequest; // (count)
        this.headRemovedCallback = this.props.headRemoved; // (count)
        this.tailRemovedCallback = this.props.tailRemoved; // (count)
        this.noscroll = !!this.props.noscroll;
        this.direction = null; // 'back' || 'forward'
        this.headaddprop = null;
        this.tailaddprop = null;
        this.scroller = null;
        // TODO turn off parent and sibling scrolling
        this.onScroll = (e) => {
        };
        this.setScrollOff = () => {
        };
        this.headRequest = () => {
        };
        this.tailRequest = () => {
        };
        this.headAdd = list => {
        };
        this.headRemove = count => {
        };
        this.tailAdd = list => {
        };
        this.tailRemove = count => {
        };
        this.viewportFrameStyle = {
            position: 'absolute',
            top: 'calc(25px + 2%)',
            left: '2%',
            bottom: '2%',
            right: '2%',
            borderRadius: '8px',
            overflow: 'hidden',
        };
        this.viewportStyle = {
            width: '100%',
            height: '100%',
            overflowX: 'auto',
        };
        this.platformStyle = {
            backgroundColor: 'white',
            height: '100%',
            width: '200%',
        };
    }
    componentDidMount() {
        // setTimeout(()=>{
        this.setState({
            scroller: this.scroller
        });
        // },500) // substantial timeout required to give scroll client time to right-size
    }
    // determine change in headadd or tailadd props
    // objects {id:string,item:ReactElement}
    componentWillReceiveProps(nextProps) {
    }
    render() {
        return <div className='CS_viewportframe' style={this.viewportFrameStyle}>
            <ScrollControlsView id='scrollcontrolsview' scroller={this.state.scroller} style={{ width: '100%', height: '100%', position: 'relative' }}>
                <div className='CS_viewport' style={this.viewportStyle} onScroll={this.onScroll} ref={el => {
            this.scroller = el;
        }}>
                    <div className='CS_platform' style={this.platformStyle}>
                        <div className='CS_list' style={{}}>
                            {this.state.children}
                        </div>
                    </div>
                </div>
            </ScrollControlsView>
        </div>;
    }
}
export default InfiniteScroll;
//# sourceMappingURL=infinitescroll.view.jsx.map