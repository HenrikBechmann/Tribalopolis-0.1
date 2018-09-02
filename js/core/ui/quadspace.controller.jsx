// quad.controller.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
import QuadToolsStrip from './quadspace/quadtoolsstrip.view';
import QuadSpaceFrame from './quadspace/quadspaceframe.view';
import QuadBasket from './quadspace/quadbasket.view';
import QuadViewport from './quadspace/quadviewport.view';
import QuantityBadge from './common/quantitybadge.view';
import QuadStatusBar from './quadspace/quadstatusbar.view';
import Quadrants from './quadrants.controller';
import { datastacks } from '../../data/datastacks';
import application from '../services/application';
class QuadspaceController extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            quadrantPositions: [0, 1, 2, 3],
            currentQuadPosition: 'topleft',
            split: 'none',
            datastacks,
        };
        this.positions = [
            'topleft',
            'topright',
            'bottomleft',
            'bottomright',
        ];
        // for swap
        this.quadmap = {
            topleft: {
                vertical: 'bottomleft',
                horizontal: 'topright',
                diagonal: 'bottomright',
            },
            topright: {
                vertical: 'bottomright',
                horizontal: 'topleft',
                diagonal: 'bottomleft',
            },
            bottomleft: {
                vertical: 'topleft',
                horizontal: 'bottomright',
                diagonal: 'topright',
            },
            bottomright: {
                vertical: 'topright',
                horizontal: 'bottomleft',
                diagonal: 'topleft',
            },
        };
        this.selectQuad = (quadrantposition) => {
            this.setState({
                currentQuadPosition: quadrantposition,
            });
        };
        this.changeSplit = (split) => {
            this.setState({
                split,
            }, () => {
                setTimeout(() => {
                    this.forceUpdate(); // for scroll icons
                }, 600);
            });
        };
        this.handleSwap = (quadrantPosition, direction) => {
            let { quadrantPositions } = this.state;
            let sourcequadindex = this.positions.indexOf(quadrantPosition);
            let targetquadposition = this.quadmap[quadrantPosition][direction];
            let targetquadindex = this.positions.indexOf(targetquadposition);
            let sourcepositionindex = quadrantPositions[sourcequadindex];
            let targetpositionindex = quadrantPositions[targetquadindex];
            // the swap
            quadrantPositions[sourcequadindex] = targetpositionindex;
            quadrantPositions[targetquadindex] = sourcepositionindex;
            this.setState({
                quadrantPositions
            });
        };
        this.calcPos = instanceid => {
            return this.state.quadrantPositions.indexOf(instanceid);
        };
        this.calcQuadrantPosition = (instanceid) => {
            let pos = this.calcPos(instanceid);
            return this.positions[pos];
        };
        this.selectQuadrant = quadrantPosition => {
            this.setState({
                currentQuadPosition: quadrantPosition,
            }, () => {
                setTimeout(() => {
                    this.setState({
                        split: 'none',
                    }, () => {
                        setTimeout(() => {
                            this.forceUpdate();
                        }, 600);
                    });
                }, 600);
            });
        };
        // TODO: the following 5 data functions should be in the application service
        this.getItem = (dataref) => {
            return application.getItem(dataref);
        };
        this.getList = (dataref) => {
            return application.getList(dataref);
        };
        // TODO: should always return an object
        this.getType = (dataref) => {
            return application.getType(dataref);
        };
        this.getLink = (dataref) => {
            return application.getLink(dataref);
        };
        this.getScheme = (dataref) => {
            return application.getScheme(dataref);
        };
        this.quadrantcallbacks = {
            handleSwap: this.handleSwap,
            getItem: this.getItem,
            getList: this.getList,
            getType: this.getType,
            selectQuadrant: this.selectQuadrant,
            calcQuadrantPosition: this.calcQuadrantPosition,
        };
        this.toolsstripcallbacks = {
            selectQuad: this.selectQuad,
            changeSplit: this.changeSplit,
        };
    }
    componentWillMount() {
        this.quadrantIdentifiers = this.state.quadrantPositions.map((value) => {
            return (value + 1).toString();
        });
    }
    render() {
        return (<QuadSpaceFrame>
                <QuadToolsStrip currentQuadPosition={this.state.currentQuadPosition} callbacks={this.toolsstripcallbacks} split={this.state.split}/>
                <QuadBasket><QuantityBadge quantity={0} style={{ left: '-12px' }}/></QuadBasket>
                <QuadViewport>
                    <Quadrants callbacks={this.quadrantcallbacks} quadrantIdentifiers={this.quadrantIdentifiers} split={this.state.split} datastacks={this.state.datastacks} currentQuadPosition={this.state.currentQuadPosition}/>
                </QuadViewport>
                <QuadStatusBar status='Something Something Something Something Something Something Something Something Something Something Something Something Something Something Something Something Something '/>
            </QuadSpaceFrame>);
    }
}
export default QuadspaceController;
//# sourceMappingURL=quadspace.controller.jsx.map