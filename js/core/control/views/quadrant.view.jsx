// quadrant.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
import QuadOrigin from './quadorigin.view';
import QuadTitleBar from './quadtitlebar.view';
import QuadBadge from './quadbadge.view';
class Quadrant extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            infocus: false,
            quadrant: null,
        };
        this.onfocusin = () => {
            if (!this.state.infocus) {
                this.props.takingfocus(this.props.sessionid, this.state.quadrant);
                this.setState({
                    infocus: true,
                });
            }
        };
        this.onfocusout = () => {
            if (this.state.infocus) {
                this.setState({
                    infocus: false,
                });
            }
        };
        this.onclick = () => {
            if (!this.state.infocus) {
                this.element.focus();
            }
        };
        this.element = null;
        this.state.quadrant = this.props.quadrant;
    }
    componentWillMount() {
        this.props.binding(this.props.sessionid, this);
    }
    render() {
        let { quadrant, color } = this.props;
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
            }
            case "bottomright": {
                bottom = 0;
                right = 0;
            }
        }
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
            outline: 'none',
        }} ref={(el) => {
            this.element = el;
        }} tabIndex={0} onFocus={this.onfocusin} onBlur={this.onfocusout} onClick={this.onclick}>
                <div style={{
            boxSizing: 'border-box',
            border: '3px outset gray',
            position: 'relative',
            backgroundColor: color,
            borderRadius: '8px',
            width: '100%',
            height: '100%',
        }}>
                    <QuadTitleBar title={this.props.title} infocus={this.state.infocus}/>
                    <QuadOrigin><QuadBadge quantity={this.props.badgequantity}/></QuadOrigin>
                </div>
            </div>);
    }
}
export default Quadrant;
//# sourceMappingURL=quadrant.view.jsx.map