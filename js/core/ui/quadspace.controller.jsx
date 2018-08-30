// quad.controller.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
// import { connect } from 'react-redux'
import QuadToolsStrip from './views/quadspace/quadtoolsstrip.view';
import QuadFrame from './views/quadspace/quadframe.view';
import QuadBasket from './views/quadspace/quadbasket.view';
import QuadViewport from './views/quadspace/quadviewport.view';
import QuadPlatform from './views/quadspace/quadplatform.view';
import Quadrant from './quadrant.controller';
import QuantityBadge from './views/common/quantitybadge.view';
import QuadStatusBar from './views/quadspace/quadstatusbar.view';
import { METATYPES } from '../constants';
import { lists, items, types, datastacks } from '../../data/repositories';
class QuadspaceController extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            quadrantpositions: [0, 1, 2, 3],
            currentquad: 'topleft',
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
        this.takingfocus = (quadrantname) => {
            this.setState({
                currentquad: quadrantname,
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
        this.handleSwap = (quadrant, direction) => {
            let { quadrantpositions } = this.state;
            let sourcequadindex = this.positions.indexOf(quadrant);
            let targetquad = this.quadmap[quadrant][direction];
            let targetquadindex = this.positions.indexOf(targetquad);
            let sourceidindex = quadrantpositions[sourcequadindex];
            let targetidindex = quadrantpositions[targetquadindex];
            // the swap
            quadrantpositions[sourcequadindex] = targetidindex;
            quadrantpositions[targetquadindex] = sourceidindex;
            this.setState({
                quadrantpositions
            });
        };
        this.calcQuadrant = (sessionid) => {
            let pos = this.state.quadrantpositions.indexOf(sessionid);
            return this.positions[pos];
        };
        this.selectQuadrant = quadrant => {
            this.setState({
                currentquad: quadrant,
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
        this.quadrants = () => {
            let { handleSwap, getDataItem, getListItem, getTypeItem } = this;
            let toolkit = {
                handleSwap,
                getDataItem,
                getListItem,
                getTypeItem,
            };
            return [
                <Quadrant key='1' sessionid={0} quadrant={this.calcQuadrant(0)} color='#e8e8e8' datastack={this.state.datastacks[0]} toolkit={toolkit} split={this.state.split} selectQuadrant={this.selectQuadrant}/>,
                <Quadrant key='2' sessionid={1} quadrant={this.calcQuadrant(1)} color='#e8e8e8' datastack={this.state.datastacks[1]} toolkit={toolkit} split={this.state.split} selectQuadrant={this.selectQuadrant}/>,
                <Quadrant key='3' sessionid={2} quadrant={this.calcQuadrant(2)} color='#e8e8e8' datastack={this.state.datastacks[2]} toolkit={toolkit} split={this.state.split} selectQuadrant={this.selectQuadrant}/>,
                <Quadrant key='4' sessionid={3} quadrant={this.calcQuadrant(3)} color='#e8e8e8' datastack={this.state.datastacks[3]} toolkit={toolkit} split={this.state.split} selectQuadrant={this.selectQuadrant}/>,
            ];
        };
    }
    render() {
        return (<QuadFrame>
                <QuadToolsStrip currentquad={this.state.currentquad} takingfocus={this.takingfocus} split={this.state.split} changeSplit={this.changeSplit}/>
                <QuadBasket><QuantityBadge quantity={0} style={{ left: '-12px' }}/></QuadBasket>
                <QuadViewport>
                    <QuadPlatform currentquad={this.state.currentquad} split={this.state.split}>
                        {this.quadrants()}
                    </QuadPlatform>
                </QuadViewport>
                <QuadStatusBar status='Something Something Something Something Something Something Something Something Something Something Something Something Something Something Something Something Something '/>
            </QuadFrame>);
    }
}
export default QuadspaceController;
//# sourceMappingURL=quadspace.controller.jsx.map