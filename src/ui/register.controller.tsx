// build.controller.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

import StandardToolbar from './common/standardtoolbar.view'
import UserAccountControlData from '../services/useraccount.controldata'

class Register extends React.Component<any,any> {

    render() {
        return (
            <div>
            <StandardToolbar />
            <p>Register Here</p>
            </div>
        )
    }
}

export default Register