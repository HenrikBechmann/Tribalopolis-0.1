// quadrant.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
import QuadOrigin from './quadorigin.view';
import QuadTitleBar from './quadtitlebar.view';
import QuadBadge from './quadbadge.view';
import InfiniteScroll from './infinitescroll.view';
class Quadrant extends React.Component {
    constructor() {
        super(...arguments);
        this.quadrant = this.props.quadrant;
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
        }}>
                <div style={{
            boxSizing: 'border-box',
            border: '3px outset gray',
            position: 'relative',
            backgroundColor: color,
            borderRadius: '8px',
            width: '100%',
            height: '100%',
        }}>
                    <QuadTitleBar title={this.props.title}/>
                    <QuadOrigin><QuadBadge quantity={this.props.badgequantity}/></QuadOrigin>
                    <InfiniteScroll />
                </div>
            </div>);
    }
}
export default Quadrant;
//# sourceMappingURL=quadrant.view.jsx.map