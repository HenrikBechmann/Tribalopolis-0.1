// build.controller.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
import StandardToolbar from './common/standardtoolbar.view';
import { toast } from 'react-toastify';
import Button from '@material-ui/core/Button';
class BuildController extends React.Component {
    render() {
        return <div>
            <StandardToolbar />
            <div style={{ height: '48px', width: '100%' }}>spacer</div>
            <div>
                <Button onClick={() => {
            toast('test toast');
        }}>toast</Button>
                Hello
            </div>
        </div>;
    }
}
export default BuildController;
//# sourceMappingURL=build.controller.jsx.map