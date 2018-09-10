// build.controller.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence

'use strict'

import React from 'react'

import StandardToolbar from './common/standardtoolbar.view'

import BaseForm from './input/baseform.view'

class BuildController extends React.Component<any,any> {

    render() {
        return <div>
            <StandardToolbar />
            <BaseForm>
                <span>Form</span>
            </BaseForm>
        </div>
    }
}

export default BuildController