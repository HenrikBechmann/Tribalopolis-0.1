// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
// quadframe.view.tsx
'use strict';
import * as React from 'react';
class QuadFrame extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            quadrant: this.props.quadrant,
        };
        // quad css position
        this.position = null;
        /********************************************************
        ------------------[ position quadrant ]------------------
        *********************************************************/
        this.calculateTransitionPosition = (quadrant) => {
            let top = 'auto';
            let left = 'auto';
            let bottom = 'auto';
            let right = 'auto';
            let quadframeelement = this.quadframeelement.current;
            switch (quadrant) {
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
        this.quadframeelement = React.createRef();
    }
    componentWillMount() {
        this.calculatePosition(this.state.quadrant);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.quadrant != this.state.quadrant) {
            let self = this;
            this.calculateTransitionPosition(this.state.quadrant);
            this.forceUpdate(() => {
                setTimeout(() => {
                    self.calculateTransitionPosition(nextProps.quadrant);
                    self.setState({
                        quadrant: nextProps.quadrant
                    }, () => {
                        setTimeout(() => {
                            self.calculatePosition(this.state.quadrant);
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
                {this.props.children}
            </div>);
    }
}
export default QuadFrame;
//# sourceMappingURL=quadframe.view.jsx.map