// quad.controller.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import React from 'react';
import QuadToolsStrip from './common/toolsstrip.view';
import QuadNavigationMenu from './quadspace/quadnavigationmenu.view';
import SplitNavigationMenu from './quadspace/splitnavigationmenu.view';
import QuadSpaceFrame from './quadspace/quadspaceframe.view';
import QuadBasket from './quadspace/quadbasket.view';
import QuadViewport from './quadspace/quadviewport.view';
import QuantityBadge from './common/quantitybadge.view';
// import QuadStatusBar from './quadspace/quadstatusbar.view'
import Quadrants from './quadrants.controller';
import VerticalDivider from './common/verticaldivider.view';
import { datastacks } from '../../data/datastacks';
import application from '../services/application';
import UserContext from '../services/user.context';
class QuadspaceController extends React.Component {
    constructor(props) {
        super(props);
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
        this.changeSplitFrom = (toggleIndex) => {
            let newIndex = null;
            if (toggleIndex == this.state.split) {
                newIndex = 'none';
            }
            else {
                newIndex = toggleIndex;
            }
            this.changeSplit(newIndex);
        };
        this.handleSwap = (quadrantPosition, direction) => {
            let { quadrantPositions } = this.state;
            // console.log('start positions',quadrantPositions, quadrantPosition, direction)
            let sourcequadindex = this.positions.indexOf(quadrantPosition);
            let targetquadposition = this.quadmap[quadrantPosition][direction];
            let targetquadindex = this.positions.indexOf(targetquadposition);
            let sourcepositionindex = quadrantPositions[sourcequadindex];
            let targetpositionindex = quadrantPositions[targetquadindex];
            // the swap
            quadrantPositions[sourcequadindex] = targetpositionindex;
            quadrantPositions[targetquadindex] = sourcepositionindex;
            // console.log('end positions',quadrantPositions)
            this.setState({
                quadrantPositions
            } /*,()=>{ // fixed by adding delay to initial timeout in quadframe
                setTimeout(()=> {
                    console.log('display workaround for Chrome')
                    let quadplatform = document.getElementById('quadplatform')
                    quadplatform.style.display = 'none'
                    quadplatform.clientHeight
                    // setTimeout(()=>{
                        quadplatform.style.display = 'block'
                    // })
                },1000)
            }*/);
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
        this.quadrantcallbacks = {
            handleSwap: this.handleSwap,
            setDocumentListener: application.setDocumentListener,
            removeDocumentListener: application.removeDocumentListener,
            getDocumentFromCache: application.getDocumentFromCache,
            selectQuadrant: this.selectQuadrant,
            calcQuadrantPosition: this.calcQuadrantPosition,
        };
        this.quadtoolsstyle = { right: '96px' };
        this.badgestyle = { left: '-12px' };
        this.quadrantIdentifiers = this.state.quadrantPositions.map((value) => {
            return (value + 1).toString();
        });
    }
    render() {
        return (<QuadSpaceFrame>
                <UserContext.Consumer>
                {user => (<QuadToolsStrip user={user} childrenposition='middle' style={this.quadtoolsstyle}>
                        <QuadNavigationMenu currentQuadPosition={this.state.currentQuadPosition} split={this.state.split} selectQuad={this.selectQuad}/>
                        <VerticalDivider />
                        <SplitNavigationMenu split={this.state.split} changeSplitFrom={this.changeSplitFrom}/>
                        <VerticalDivider />
                    </QuadToolsStrip>)}
                </UserContext.Consumer>
                <QuadBasket><QuantityBadge quantity={0} style={this.badgestyle}/></QuadBasket>
                <QuadViewport>
                    <Quadrants quadrantIdentifiers={this.quadrantIdentifiers} split={this.state.split} datastacks={this.state.datastacks} currentQuadPosition={this.state.currentQuadPosition} callbacks={this.quadrantcallbacks}/>
                </QuadViewport>
            </QuadSpaceFrame>);
    }
}
export default QuadspaceController;
//# sourceMappingURL=quadspace.controller.jsx.map