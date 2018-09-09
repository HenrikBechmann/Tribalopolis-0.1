// build.controller.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence

'use strict'

import React from 'react'

import StandardToolbar from './common/standardtoolbar.view'

import { toast } from 'react-toastify'

import Button from '@material-ui/core/Button'

class BuildController extends React.Component<any,any> {

    render() {
        return <div>
            <StandardToolbar />
        </div>
    }
}

export default BuildController