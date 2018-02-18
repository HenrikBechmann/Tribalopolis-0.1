// quad.controller.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
import { connect } from 'react-redux';
import QuadToolsStrip from './views/quadtoolsstrip.view';
import QuadFrame from './views/quadframe.view';
import QuadBasket from './views/quadbasket.view';
import QuadViewport from './views/quadviewport.view';
import QuadPlatform from './views/quadplatform.view';
import Quadrant from './views/quadrant.view';
import QuadDiamond from './views/quaddiamond.view';
import QuadBadge from './views/quadbadge.view';
class QuadspaceController extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            quadrantindexes: [0, 1, 2, 3]
        };
        // quadrants can be re-arranged; quadrant attribute needs to be updated
        this.positions = [
            'topleft',
            'topright',
            'bottomleft',
            'bottomright',
        ];
        this.quadrantlookup = null;
    }
    render() {
        let quadrantindexes = this.state.quadrantindexes;
        return (<QuadFrame>
                <QuadToolsStrip />
                <QuadBasket><QuadBadge quantity={0} style={{ left: '-12px' }}/></QuadBasket>
                <QuadViewport>
                    <QuadPlatform>
                        <Quadrant key='1' sessionid={0} quadrant={this.positions[quadrantindexes[0]]} color='lightgreen' title='first' badgequantity={0} status='not bad'/>
                        <Quadrant key='2' sessionid={1} quadrant={this.positions[quadrantindexes[1]]} color='mistyrose' title="second" badgequantity={0} status="OK"/>
                        <Quadrant key='3' sessionid={2} quadrant={this.positions[quadrantindexes[2]]} color='lightblue' title="third" badgequantity={0} status="Good"/>
                        <Quadrant key='4' sessionid={3} quadrant={this.positions[quadrantindexes[3]]} color='papayawhip' title="fourth" badgequantity={0} status="bad"/>
                        <QuadDiamond />
                    </QuadPlatform>
                </QuadViewport>
            </QuadFrame>);
    }
}
let mapStateToProps = state => {
    let { resources } = state;
    return {
        resources,
    };
};
export default connect(mapStateToProps)(QuadspaceController);
//# sourceMappingURL=quadspace.controller.jsx.map