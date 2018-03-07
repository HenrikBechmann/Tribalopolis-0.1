// continuousscroll.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
import ScrollControlsView from './scrollcontrols.view';
class InfiniteScroll extends React.Component {
    constructor(props) {
        super(props);
        this.state = null;
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
            display: 'flex',
            flexWrap: 'nowrap',
            backgroundColor: 'silver',
        };
        this.platformStyle = {
            position: 'relative',
            display: 'flex',
            height: '100%',
            flexWrap: 'nowrap',
            boxSizing: 'border-box',
            margin: '0 auto 0 auto',
        };
        this.listStyle = {
            display: 'flex',
            position: 'relative',
            flexWrap: 'nowrap',
            height: '100%',
            marginLeft: '30px',
            boxSizing: 'border-box',
            borderRadius: '6px',
            padding: '2% 0 0 0',
        };
        this.state = {
            items: this.props.items,
            scrolling: false,
            scroller: null,
            continuous: !!props.continuous
        };
    }
    componentDidMount() {
        this.setState({
            scroller: this.scroller
        });
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
                        <div className='CS_list' style={this.listStyle}>
                            {this.state.items}
                        </div>
                    </div>
                </div>
            </ScrollControlsView>
        </div>;
    }
}
export default InfiniteScroll;
//# sourceMappingURL=infinitescroll.view.jsx.map