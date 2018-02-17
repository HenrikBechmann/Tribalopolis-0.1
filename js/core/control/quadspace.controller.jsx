// quad.controller.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
import QuadToolsStrip from './views/toolstrip.view';
import QuadFrame from './views/quadframe.view';
import QuadBasket from './views/quadbasket.view';
import QuadViewport from './views/quadviewport.view';
import QuadPlatform from './views/quadplatform.view';
class QuadspaceController extends React.Component {
    render() {
        return (<QuadFrame>
                <QuadToolsStrip />
                <QuadBasket />
                <QuadViewport>
                    <QuadPlatform>
                    </QuadPlatform>
                </QuadViewport>
            </QuadFrame>);
    }
}
export default QuadspaceController;
//# sourceMappingURL=quadspace.controller.jsx.map