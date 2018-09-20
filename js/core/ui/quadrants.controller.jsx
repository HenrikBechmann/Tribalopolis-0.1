// quadrants.controller.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import React from 'react';
import QuadPlatform from './quadspace/quadplatform.view';
import QuadFrame from './quadrant/quadframe.view';
import Quadrant from './quadrant.controller';
const Quadrants = props => {
    // repackage callbacks for children
    let { handleSwap, setItemListener, setListListener, selectQuadrant, calcQuadrantPosition } = props.callbacks;
    let quadcallbacks = {
        setItemListener,
        setListListener,
    };
    let framecallbacks = {
        handleSwap,
        selectQuadrant,
    };
    // get data for distribution
    let { split, quadrantIdentifiers, datastacks, currentQuadPosition } = props;
    let quad;
    (function (quad) {
        quad[quad["one"] = 0] = "one";
        quad[quad["two"] = 1] = "two";
        quad[quad["three"] = 2] = "three";
        quad[quad["four"] = 3] = "four";
    })(quad || (quad = {})); // 0,1,2,3
    return (<QuadPlatform currentQuadPosition={currentQuadPosition} split={split}>
            <QuadFrame quadrantPosition={calcQuadrantPosition(quad.one)} split={split} callbacks={framecallbacks}>
                <Quadrant quadidentifier={quadrantIdentifiers[quad.one]} color='#e8e8e8' datastack={datastacks[quad.one]} callbacks={quadcallbacks}/>
            </QuadFrame>
            <QuadFrame quadrantPosition={calcQuadrantPosition(quad.two)} callbacks={framecallbacks} split={split}>
                <Quadrant quadidentifier={quadrantIdentifiers[quad.two]} color='#e8e8e8' datastack={datastacks[quad.two]} callbacks={quadcallbacks}/>
            </QuadFrame>
            <QuadFrame quadrantPosition={calcQuadrantPosition(quad.three)} callbacks={framecallbacks} split={split}>
                <Quadrant quadidentifier={quadrantIdentifiers[quad.three]} color='#e8e8e8' datastack={datastacks[quad.three]} callbacks={quadcallbacks}/>
            </QuadFrame>
            <QuadFrame quadrantPosition={calcQuadrantPosition(quad.four)} callbacks={framecallbacks} split={split}>
                <Quadrant quadidentifier={quadrantIdentifiers[quad.four]} color='#e8e8e8' datastack={datastacks[quad.four]} callbacks={quadcallbacks}/>
            </QuadFrame>
        </QuadPlatform>);
};
export default Quadrants;
//# sourceMappingURL=quadrants.controller.jsx.map