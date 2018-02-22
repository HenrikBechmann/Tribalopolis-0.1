// quadplatform.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
class QuadPlatform extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            currentquad: this.props.currentquad,
            top: 'auto',
            left: 'auto',
            bottom: 'auto',
            right: 'auto',
        };
        this.element = null;
        this.nextquad = this.props.currentquad;
    }
    componentWillReceiveProps(nextProps) {
        // set properties to prepare for animation
        if (nextProps.currentquad != this.state.currentquad) {
            this.nextquad = nextProps.currentquad;
            let top = this.element.offsetTop + 'px';
            let left = this.element.offsetLeft + 'px';
            let bottom = 'auto';
            let right = 'auto';
            this.setState({
                top,
                left,
                bottom,
                right,
            });
        }
    }
    componentDidUpdate() {
        let nextquad = this.nextquad;
        // set values for animation
        if (nextquad != this.state.currentquad) {
            let currentquad = nextquad;
            let top = 'auto';
            let left = 'auto';
            let right = 'auto';
            let bottom = 'auto';
            switch (currentquad) {
                case 'topleft': {
                    top = '0';
                    left = '0';
                    break;
                }
                case 'topright': {
                    top = '0';
                    left = -this.element.parentElement.offsetWidth + 'px';
                    // right = '0'
                    break;
                }
                case 'bottomleft': {
                    // bottom = '0'
                    top = -this.element.parentElement.offsetHeight + 'px';
                    left = '0';
                    break;
                }
                case 'bottomright': {
                    top = -this.element.parentElement.offsetHeight + 'px';
                    left = -this.element.parentElement.offsetWidth + 'px';
                    // bottom = '0'
                    // right = '0'
                    break;
                }
            }
            setTimeout(() => {
                this.setState({
                    currentquad: nextquad,
                    top,
                    left,
                    right,
                    bottom,
                }, () => {
                    setTimeout(() => {
                        switch (currentquad) {
                            case 'topleft': {
                                top = '0';
                                left = '0';
                                break;
                            }
                            case 'topright': {
                                top = '0';
                                left = 'auto';
                                right = '0';
                                break;
                            }
                            case 'bottomleft': {
                                bottom = '0';
                                top = 'auto';
                                left = '0';
                                break;
                            }
                            case 'bottomright': {
                                top = 'auto';
                                left = 'auto';
                                bottom = '0';
                                right = '0';
                                break;
                            }
                        }
                        this.setState({
                            currentquad: nextquad,
                            top,
                            left,
                            right,
                            bottom,
                        });
                    }, 600);
                });
            });
        }
    }
    render() {
        let { currentquad, left, right, top, bottom } = this.state;
        return (<div id="quadplatform" style={{
            position: 'absolute',
            width: '200%',
            height: '200%',
            top,
            left,
            bottom,
            right,
            transition: 'top .5s ease,left .5s ease'
        }} ref={el => {
            this.element = el;
        }}>
            {this.props.children}
        </div>);
    }
}
export default QuadPlatform;
//# sourceMappingURL=quadplatform.view.jsx.map