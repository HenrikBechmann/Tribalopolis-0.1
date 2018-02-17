// quad.controller.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
import QuadToolsStrip from './views/quadtoolsstrip.view';
import QuadFrame from './views/quadframe.view';
import QuadBasket from './views/quadbasket.view';
import QuadViewport from './views/quadviewport.view';
import QuadPlatform from './views/quadplatform.view';
import Quadrant from './views/quadrant.view';
import QuadDiamond from './views/quaddiamond.view';
class QuadspaceController extends React.Component {
    render() {
        return (<QuadFrame>
                <QuadToolsStrip />
                <QuadBasket />
                <QuadViewport>
                    <QuadPlatform>
                        <Quadrant quadrant='topleft' color='lightgreen' title="first" status="not bad"/>
                        <Quadrant quadrant='topright' color='pink' title="second" status="OK"/>
                        <Quadrant quadrant='bottomleft' color='lightblue' title="third" status="Good"/>
                        <Quadrant quadrant='bottomright' color='lightyellow' title="fourth" status="bad"/>
                        <QuadDiamond />
                    </QuadPlatform>
                </QuadViewport>
            </QuadFrame>);
    }
}
export default QuadspaceController;
//# sourceMappingURL=quadspace.controller.jsx.map