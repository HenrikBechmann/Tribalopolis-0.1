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
import { METATYPES } from '../constants';
import { lists, items, types, datastacks } from '../../data/repositories';
class QuadspaceController extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            quadrantpositions: [0, 1, 2, 3],
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
            let { quadrantpositions } = this.state;
            let sourcequadindex = this.positions.indexOf(quadrantPosition);
            let targetquadposition = this.quadmap[quadrantPosition][direction];
            let targetquadindex = this.positions.indexOf(targetquadposition);
            let sourceidindex = quadrantpositions[sourcequadindex];
            let targetidindex = quadrantpositions[targetquadindex];
            // the swap
            quadrantpositions[sourcequadindex] = targetidindex;
            quadrantpositions[targetquadindex] = sourceidindex;
            this.setState({
                quadrantpositions
            });
        };
        this.calcPos = instanceid => {
            return this.state.quadrantpositions.indexOf(instanceid);
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
        // TODO: the following 3 data functions should be in the application service
        this.getDataItem = (dataref) => {
            return items[dataref.uid];
        };
        this.getListItem = (dataref) => {
            return lists[dataref.uid];
        };
        // TODO: should always return an object
        this.getTypeItem = (metatype, dataref) => {
            let typeitem;
            if (types[METATYPES[metatype]][dataref.schemeuid]) {
                typeitem = types[METATYPES[metatype]][dataref.schemeuid][dataref.uid] ||
                    types[METATYPES[metatype]][dataref.schemeuid]['__default__'];
            }
            typeitem = typeitem || null;
            return typeitem;
        };
        this.quadranttoolkit = {
            handleSwap: this.handleSwap,
            getDataItem: this.getDataItem,
            getListItem: this.getListItem,
            getTypeItem: this.getTypeItem,
            selectQuadrant: this.selectQuadrant,
            calcQuadrantPosition: this.calcQuadrantPosition,
        };
        this.toolsstriptoolkit = {
            selectQuad: this.selectQuad,
            changeSplit: this.changeSplit,
        };
    }
    componentWillMount() {
        this.quadrantIdentifiers = this.state.quadrantpositions.map((value) => {
            return (value + 1).toString();
        });
    }
    render() {
        return (<QuadSpaceFrame>
                <QuadToolsStrip currentQuadPosition={this.state.currentQuadPosition} toolkit={this.toolsstriptoolkit} split={this.state.split}/>
                <QuadBasket><QuantityBadge quantity={0} style={{ left: '-12px' }}/></QuadBasket>
                <QuadViewport>
                    <Quadrants toolkit={this.quadranttoolkit} quadrantIdentifiers={this.quadrantIdentifiers} split={this.state.split} datastacks={this.state.datastacks} currentQuadPosition={this.state.currentQuadPosition}/>
                </QuadViewport>
                <QuadStatusBar status='Something Something Something Something Something Something Something Something Something Something Something Something Something Something Something Something Something '/>
            </QuadSpaceFrame>);
    }
}
export default QuadspaceController;
//# sourceMappingURL=quadspace.controller.jsx.map