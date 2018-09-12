// build.controller.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import React from 'react';
import StandardToolbar from './common/standardtoolbar.view';
import BaseForm from './input/baseform.view';
import SelectField from './input/selectfield.view';
import BasicEditor from './input/basiceditor.view';
class BuildController extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            values: { collection: 'types' }
        };
        this.onChangeValue = event => {
            let { values } = this.state;
            values[event.target.name] = event.target.value;
            console.log('onchange values', values);
            this.setState({ values });
        };
    }
    render() {
        return <div>
            <StandardToolbar />
            <BaseForm>
                <SelectField label={'Collection'} input={{ name: 'collection', id: 'collection-id' }} select={{
            value: this.state.values.collection,
            onChange: this.onChangeValue
        }} helpertext={'select a collection'} options={[
            {
                value: 'types',
                text: 'types',
            },
            {
                value: 'schemas',
                text: 'schemas',
            },
            {
                value: 'items',
                text: 'items',
            },
            {
                value: 'lists',
                text: 'lists',
            },
            {
                value: 'links',
                text: 'links',
            },
            {
                value: 'folders',
                text: 'folders',
            },
            {
                value: 'accounts',
                text: 'accounts',
            },
        ]}/>
            </BaseForm>
            <BasicEditor />
        </div>;
    }
}
export default BuildController;
//# sourceMappingURL=build.controller.jsx.map