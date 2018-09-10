// build.controller.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import React from 'react';
import StandardToolbar from './common/standardtoolbar.view';
import BaseForm from './input/baseform.view';
import BasicEditor from './input/basiceditor.view';
class BuildController extends React.Component {
    render() {
        return <div>
            <StandardToolbar />
            <BaseForm>
                <span>Form</span>
            </BaseForm>
            <BasicEditor />
        </div>;
    }
}
export default BuildController;
//# sourceMappingURL=build.controller.jsx.map