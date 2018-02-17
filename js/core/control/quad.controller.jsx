// quad.controller.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
import Toolstrip from './views/toolstrip.view';
import QuadFrame from './views/quadframe.view';
class QuadController extends React.Component {
    render() {
        return (<QuadFrame>
                <Toolstrip />
                <div id="quadbasket" style={{ position: 'absolute', top: '0', right: '0', width: '96px', height: '96px', backgroundColor: 'black', zIndex: 1, }}></div>
                <div id="quadviewport" style={{ position: 'absolute', top: '48px', left: '0', right: '0', bottom: '0', backgroundColor: 'tan', overflow: 'scroll' }}>
                    <div id="quadplatform" style={{
            position: 'relative',
            width: '200%',
            height: '200%',
        }}>
                        quad
                    </div>
                 </div>
            </QuadFrame>);
    }
}
export default QuadController;
//# sourceMappingURL=quad.controller.jsx.map