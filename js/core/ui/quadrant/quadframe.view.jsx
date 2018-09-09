// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
// quadframe.view.tsx
'use strict';
import React from 'react';
import SwapMenu from './quadswapmenu.view';
import QuadSelector from './quadselector.view';
class QuadFrame extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            quadrantPosition: this.props.quadrantPosition,
        };
        // quad css position
        this.position = null;
        /********************************************************
        ------------------[ position quadrantPosition ]------------------
        *********************************************************/
        this.calculateTransitionPosition = (quadrantPosition) => {
            let top = 'auto';
            let left = 'auto';
            let bottom = 'auto';
            let right = 'auto';
            let quadframeelement = this.quadframeelement.current;
            switch (quadrantPosition) {
                case "topleft": {
                    top = 0;
                    left = 0;
                    break;
                }
                case "topright": {
                    top = 0;
                    left = (quadframeelement.parentElement.offsetWidth / 2) + 'px';
                    break;
                }
                case "bottomleft": {
                    top = (quadframeelement.parentElement.offsetHeight / 2) + 'px';
                    left = 0;
                    break;
                }
                case "bottomright": {
                    top = (quadframeelement.parentElement.offsetHeight / 2) + 'px';
                    left = (quadframeelement.parentElement.offsetWidth / 2) + 'px';
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
        this.calculatePosition = (quadrantPosition) => {
            let top = 'auto';
            let left = 'auto';
            let bottom = 'auto';
            let right = 'auto';
            switch (quadrantPosition) {
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
        this.quadframeelement = React.createRef();
    }
    componentWillMount() {
        this.calculatePosition(this.state.quadrantPosition);
    }
    // TODO: migrate code to componentDidUpdate
    componentWillReceiveProps(nextProps) {
        if (nextProps.quadrantPosition != this.state.quadrantPosition) {
            let self = this;
            self.calculateTransitionPosition(self.state.quadrantPosition);
            self.forceUpdate(() => {
                setTimeout(() => {
                    self.calculateTransitionPosition(nextProps.quadrantPosition);
                    self.setState({
                        quadrantPosition: nextProps.quadrantPosition
                    }, () => {
                        setTimeout(() => {
                            self.calculatePosition(self.state.quadrantPosition);
                            self.forceUpdate();
                        }, 600);
                    });
                });
            });
        }
    }
    render() {
        let { top, left, bottom, right } = this.position;
        let quadframestyle = {
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
        };
        return (<div style={quadframestyle} ref={this.quadframeelement}>
                <SwapMenu quadrantPosition={this.state.quadrantPosition} handleSwap={this.props.callbacks.handleSwap}/>
                {this.props.children}
                <QuadSelector quadrantPosition={this.state.quadrantPosition} split={this.props.split} selectQuadrant={this.props.callbacks.selectQuadrant}/>
            </div>);
    }
}
export default QuadFrame;
//# sourceMappingURL=quadframe.view.jsx.map