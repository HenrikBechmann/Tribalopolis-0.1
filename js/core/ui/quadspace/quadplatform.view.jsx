// quadplatform.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import React from 'react';
class QuadPlatform extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentQuadPosition: this.props.currentQuadPosition,
            split: this.props.split,
        };
        this.positions = null;
        this.dimensions = null;
        this.element = null;
        this.changeCurrentQuad = nextProps => {
            let element = this.element;
            // set top left for animation
            let nextquadposition = nextProps.currentQuadPosition;
            this.calculateTransitionPosition(this.state.currentQuadPosition);
            // console.log('BASE changing from quad',this.state.currentQuadPosition,this.positions)
            this.forceUpdate(() => {
                setTimeout(() => {
                    // prepare for animation transition
                    this.calculateTransitionPosition(nextquadposition);
                    // console.log('TRANSITION changing to quad',nextquadposition,this.positions)
                    this.setState({
                        currentQuadPosition: nextquadposition,
                    }, () => {
                        setTimeout(() => {
                            this.calculatePosition(nextquadposition);
                            this.setState({
                                currentQuadPosition: nextquadposition,
                            }, () => {
                                // console.log('DONE changing quad',nextquadposition,this.positions)
                            });
                        }, 600);
                    });
                }, 50);
            });
        };
        this.updatingsplit = false;
        this.calculateTransitionPosition = quadrant => {
            let { split } = this.state;
            let top = null;
            let left = null;
            let right = 'auto';
            let bottom = 'auto';
            switch (quadrant) {
                case 'topleft': {
                    switch (split) {
                        case 'none':
                            top = '0';
                            left = '0';
                            break;
                        case 'horizontal':
                            top = '0';
                            left = '0';
                            break;
                        case 'vertical':
                            top = '0';
                            left = '0';
                            break;
                        case 'matrix':
                            top = '0';
                            left = '0';
                            break;
                    }
                    break;
                }
                case 'topright': {
                    switch (split) {
                        case 'none':
                            top = '0';
                            left = -this.element.parentElement.offsetWidth + 'px';
                            break;
                        case 'horizontal':
                            top = '0';
                            left = '0';
                            break;
                        case 'vertical':
                            top = '0';
                            left = -this.element.parentElement.offsetWidth + 'px';
                            break;
                        case 'matrix':
                            top = '0';
                            left = '0';
                            break;
                    }
                    break;
                }
                case 'bottomleft': {
                    switch (split) {
                        case 'none':
                            top = -this.element.parentElement.offsetHeight + 'px';
                            left = '0';
                            break;
                        case 'horizontal':
                            top = -this.element.parentElement.offsetHeight + 'px';
                            left = '0';
                            break;
                        case 'vertical':
                            top = '0';
                            left = '0';
                            break;
                        case 'matrix':
                            top = '0';
                            left = '0';
                            break;
                    }
                    break;
                }
                case 'bottomright': {
                    switch (split) {
                        case 'none':
                            top = -this.element.parentElement.clientHeight + 'px'; //offsetHeight + 'px'
                            left = -this.element.parentElement.clientWidth + 'px'; //offsetWidth + 'px'
                            break;
                        case 'horizontal':
                            top = -this.element.parentElement.clientHeight + 'px'; //offsetHeight + 'px'
                            left = '0';
                            break;
                        case 'vertical':
                            top = '0';
                            left = -this.element.parentElement.clientWidth + 'px'; //offsetWidth + 'px'
                            break;
                        case 'matrix':
                            top = '0';
                            left = '0';
                            break;
                    }
                    break;
                }
            }
            this.positions = {
                top,
                left,
                right,
                bottom,
            };
        };
        this.calculatePosition = (quadrant) => {
            let top = 'auto';
            let left = 'auto';
            let right = 'auto';
            let bottom = 'auto';
            switch (quadrant) {
                case 'topleft': {
                    top = '0';
                    left = '0';
                    break;
                }
                case 'topright': {
                    top = '0';
                    right = '0';
                    break;
                }
                case 'bottomleft': {
                    bottom = '0';
                    left = '0';
                    break;
                }
                case 'bottomright': {
                    bottom = '0';
                    right = '0';
                    break;
                }
            }
            this.positions = {
                top,
                left,
                right,
                bottom,
            };
        };
        this.calculateDimensions = (split) => {
            let width = null;
            let height = null;
            switch (split) {
                case 'none': {
                    width = '200%';
                    height = '200%';
                    break;
                }
                case 'horizontal': {
                    width = '100%';
                    height = '200%';
                    break;
                }
                case 'vertical': {
                    width = '200%';
                    height = '100%';
                    break;
                }
                case 'matrix': {
                    width = '100%';
                    height = '100%';
                    break;
                }
            }
            this.dimensions = {
                width,
                height,
            };
        };
        this.calculateDimensions(this.state.split);
        this.calculatePosition(this.state.currentQuadPosition);
    }
    componentDidUpdate() {
        if ((this.props.split != this.state.split) && !this.updatingsplit) {
            this.updatingsplit = true;
            this.calculateDimensions(this.props.split);
            this.setState({
                split: this.props.split
            }, () => {
                this.updatingsplit = false;
            });
        }
        if (this.props.currentQuadPosition != this.state.currentQuadPosition) {
            setTimeout(() => {
                this.changeCurrentQuad(this.props);
            });
        }
    }
    render() {
        let { left, right, top, bottom } = this.positions;
        let { width, height } = this.dimensions;
        // console.log('render quadplatform',this.positions,this.dimensions)
        return (<div id="quadplatform" style={{
            position: 'absolute',
            width,
            height,
            top,
            left,
            bottom,
            right,
            transition: 'top .5s ease,left .5s ease, width .5s ease, height .5s ease'
        }} ref={el => {
            this.element = el;
        }}>
                {this.props.children}
            </div>);
    }
}
export default QuadPlatform;
//# sourceMappingURL=quadplatform.view.jsx.map