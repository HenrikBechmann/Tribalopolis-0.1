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
import QuadStatusBar from './views/quadstatusbar.view';
class QuadspaceController extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            quadrantindexes: [0, 1, 2, 3],
            currentquad: 'topleft',
        };
        // quadrants can be re-arranged; quadrant attribute needs to be updated
        this.positions = [
            'topleft',
            'topright',
            'bottomleft',
            'bottomright',
        ];
        this.quadbindings = [null, null, null, null];
        this.binding = (sessionid, quad) => {
            this.quadbindings[sessionid] = quad;
        };
        this.takingfocus = (quadrantname) => {
            this.setState({
                currentquad: quadrantname,
            });
        };
    }
    componentDidMount() {
        this.forceUpdate();
        console.log('quads after mount', this.quadbindings);
    }
    render() {
        let quadrantindexes = this.state.quadrantindexes;
        return (<QuadFrame>
                <QuadToolsStrip bindings={this.quadbindings} currentquad={this.state.currentquad} takingfocus={this.takingfocus}/>
                <QuadBasket><QuadBadge quantity={3000} style={{ left: '-12px' }}/></QuadBasket>
                <QuadViewport>
                    <QuadPlatform currentquad={this.state.currentquad}>
                        <Quadrant key='1' sessionid={0} binding={this.binding} quadrant={this.positions[quadrantindexes[0]]} color='lightgreen' title='first' badgequantity={500}/>
                        <Quadrant key='2' sessionid={1} binding={this.binding} quadrant={this.positions[quadrantindexes[1]]} color='mistyrose' title="second" badgequantity={0}/>
                        <Quadrant key='3' sessionid={2} binding={this.binding} quadrant={this.positions[quadrantindexes[2]]} color='lightblue' title="third" badgequantity={12}/>
                        <Quadrant key='4' sessionid={3} binding={this.binding} quadrant={this.positions[quadrantindexes[3]]} color='papayawhip' title="fourth" badgequantity={0}/>
                        <QuadDiamond />
                    </QuadPlatform>
                </QuadViewport>
                <QuadStatusBar status='Something'/>
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