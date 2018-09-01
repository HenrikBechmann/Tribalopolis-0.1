// quadrants.controller.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
import QuadPlatform from './quadspace/quadplatform.view';
import QuadFrame from './quadrant/quadframe.view';
import Quadrant from './quadrant.controller';
const Quadrants = props => {
    // repackage toolkit for children
    let { handleSwap, getDataItem, getListItem, getTypeItem, selectQuadrant, calcQuadrantPosition } = props.toolkit;
    let quadtoolkit = {
        getDataItem,
        getListItem,
        getTypeItem,
    };
    let frametoolkit = {
        handleSwap,
        selectQuadrant,
    };
    // get data for distribution
    let { split, quadrantidentifiers, datastacks, currentQuadPosition } = props;
    let instance;
    (function (instance) {
        instance[instance["one"] = 0] = "one";
        instance[instance["two"] = 1] = "two";
        instance[instance["three"] = 2] = "three";
        instance[instance["four"] = 3] = "four";
    })(instance || (instance = {})); // 0,1,2,3
    return (<QuadPlatform currentQuadPosition={currentQuadPosition} split={split}>
            <QuadFrame quadrantPosition={calcQuadrantPosition(instance.one)} split={split} toolkit={frametoolkit}>
                <Quadrant quadidentifier={quadrantidentifiers[instance.one]} color='#e8e8e8' datastack={datastacks[instance.one]} toolkit={quadtoolkit}/>
            </QuadFrame>
            <QuadFrame quadrantPosition={calcQuadrantPosition(instance.two)} toolkit={frametoolkit} split={split}>
                <Quadrant quadidentifier={quadrantidentifiers[instance.two]} color='#e8e8e8' datastack={datastacks[instance.two]} toolkit={quadtoolkit}/>
            </QuadFrame>
            <QuadFrame quadrantPosition={calcQuadrantPosition(instance.three)} toolkit={frametoolkit} split={split}>
                <Quadrant quadidentifier={quadrantidentifiers[instance.three]} color='#e8e8e8' datastack={datastacks[instance.three]} toolkit={quadtoolkit}/>
            </QuadFrame>
            <QuadFrame quadrantPosition={calcQuadrantPosition(instance.four)} toolkit={frametoolkit} split={split}>
                <Quadrant quadidentifier={quadrantidentifiers[instance.four]} color='#e8e8e8' datastack={datastacks[instance.four]} toolkit={quadtoolkit}/>
            </QuadFrame>
        </QuadPlatform>);
};
export default Quadrants;
//# sourceMappingURL=quadrants.controller.jsx.map