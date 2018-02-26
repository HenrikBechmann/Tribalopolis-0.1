// quadrant.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
import QuadOrigin from './quadorigin.view';
import QuadTitleBar from './quadtitlebar.view';
import QuadBadge from './quadbadge.view';
import InfiniteScroll from '../common/infinitescroll.view';
import SwapMenu from './quadswapmenu.view';
import DataBox from '../databox/databox.view';
import QuadSelector from './quadselector.view';
class Quadrant extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            quadrant: this.props.quadrant,
            data: this.props.data
        };
        this.sessionid = this.props.sessionid;
        this.applyTransitionPosition = () => {
            let element = this.element;
            let { top, right, bottom, left } = this.position;
            element.style.top = top;
            element.style.right = right;
            element.style.bottom = bottom;
            element.style.left = left;
        };
        this.calculateTransitionPosition = (quadrant) => {
            let top = 'auto';
            let left = 'auto';
            let bottom = 'auto';
            let right = 'auto';
            let element = this.element;
            switch (quadrant) {
                case "topleft": {
                    top = 0;
                    left = 0;
                    break;
                }
                case "topright": {
                    top = 0;
                    left = element.parentElement.offsetWidth / 2;
                    break;
                }
                case "bottomleft": {
                    top = element.parentElement.offsetHeight / 2;
                    left = 0;
                    break;
                }
                case "bottomright": {
                    top = element.parentElement.offsetHeight / 2;
                    left = element.parentElement.offsetWidth / 2;
                    break;
                }
            }
            this.position = {
                top,
                left,
                bottom,
                right,
            };
        };
        this.calculatePosition = (quadrant) => {
            let top = 'auto';
            let left = 'auto';
            let bottom = 'auto';
            let right = 'auto';
            switch (quadrant) {
                case "topleft": {
                    top = 0;
                    left = 0;
                    break;
                }
                case "topright": {
                    top = 0;
                    right = 0;
                    break;
                }
                case "bottomleft": {
                    bottom = 0;
                    left = 0;
                    break;
                }
                case "bottomright": {
                    bottom = 0;
                    right = 0;
                    break;
                }
            }
            this.position = {
                top,
                left,
                bottom,
                right,
            };
        };
        this.position = null;
        this.element = null;
        this.getFieldComponents = fields => {
        };
        this.getProfileComponent = profile => {
        };
        this.getBacklinks = links => {
        };
        this.getBoxes = () => {
            let boxes = [];
            let { data } = this.state;
            if (data) {
                boxes = this.state.data.map((item) => {
                    return <DataBox key={item.sessionid} item={item}/>;
                });
            }
            return boxes;
        };
    }
    componentWillMount() {
        this.calculatePosition(this.state.quadrant);
        // console.log('data',this.state.data)
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.quadrant != this.state.quadrant) {
            let self = this;
            this.calculateTransitionPosition(this.state.quadrant);
            this.applyTransitionPosition();
            setTimeout(() => {
                // this.forceUpdate(() => {
                this.calculateTransitionPosition(nextProps.quadrant);
                this.setState({
                    quadrant: nextProps.quadrant
                }, () => {
                    setTimeout(() => {
                        self.calculatePosition(this.state.quadrant);
                        this.applyTransitionPosition();
                        // self.forceUpdate()
                    }, 600);
                });
                // })
            }, 50);
        }
    }
    render() {
        let { color } = this.props;
        let { quadrant } = this.state;
        let { top, left, bottom, right } = this.position;
        return (<div style={{
            position: 'absolute',
            boxSizing: 'border-box',
            width: '50%',
            height: '50%',
            padding: '3px',
            top,
            left,
            bottom,
            right,
            border: '1px solid transparent',
            transition: 'all .5s ease'
        }} ref={(element) => {
            this.element = element;
        }}>
                <div style={{
            boxSizing: 'border-box',
            border: '3px outset gray',
            position: 'relative',
            backgroundColor: color,
            borderRadius: '8px',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
        }}>
                    <SwapMenu quadrant={this.state.quadrant} handleswap={this.props.handleswap}/>
                    <QuadTitleBar title={this.props.title}/>
                    <QuadOrigin><QuadBadge quantity={this.props.badgequantity}/></QuadOrigin>
                    <InfiniteScroll items={this.getBoxes()}/>
                    <QuadSelector quadrant={this.state.quadrant} split={this.props.split} quadselection={this.props.quadselection}/>
                </div>
            </div>);
    }
}
export default Quadrant;
//# sourceMappingURL=quadrant.view.jsx.map