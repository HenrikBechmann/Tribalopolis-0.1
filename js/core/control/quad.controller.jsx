// quad.controller.tsx
'use strict';
import * as React from 'react';
import Toolstrip from './views/toolstrip.view';
class QuadController extends React.Component {
    render() {
        return (<div id="quadframe" style={{ position: 'fixed', height: '100%', width: '100%' }}>
                <Toolstrip />
                <div id="basket" style={{ position: 'absolute', top: '0', right: '0', width: '96px', height: '96px', backgroundColor: 'black', zIndex: 1, }}></div>
                <div id="quadviewport" style={{ position: 'absolute', top: '48px', left: '0', right: '0', bottom: '0', backgroundColor: 'tan', overflow: 'scroll' }}>
                    <div id="quadplatform" style={{
            width: '200%',
            height: '200%',
        }}>
                        quad
                    </div>
                 </div>
            </div>);
    }
}
export default QuadController;
//# sourceMappingURL=quad.controller.jsx.map