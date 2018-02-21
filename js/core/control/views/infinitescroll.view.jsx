// continuousscroll.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
class InfiniteScroll extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            children: this.props.startset,
            scrolling: false,
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
            top: '50px',
            left: '25px',
            bottom: '25px',
            right: '25px',
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
    // determine change in headadd or tailadd props
    // objects {id:string,item:ReactElement}
    componentWillReceiveProps(nextProps) {
    }
    render() {
        return <div className='CS_viewportframe' style={this.viewportFrameStyle}>
            <div className='CS_viewport' style={this.viewportStyle} onScroll={this.onScroll}>
                <div className='CS_platform' style={this.platformStyle}>
                    <div className='CS_list' style={{}}>
                        {this.state.children}
                    </div>
                </div>
            </div>
        </div>;
    }
}
export default InfiniteScroll;
//# sourceMappingURL=infinitescroll.view.jsx.map