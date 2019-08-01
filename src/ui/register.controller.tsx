// build.controller.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

import StandardToolbar from './common/standardtoolbar.view'
// import UserAccountControlData from '../services/useraccount.controldata'

import administration from '../services/application'

class Register extends React.Component<any,any> {

    render() {
        let { userdata } = administration
        return (
            <div>
                <StandardToolbar />
                {(userdata.status == 'loggedin') && <p>Thanks for logging in! Now just register here and you'll be all set. [pending]</p>}
                {(userdata.status == 'registered-user') && <p>Thanks for logging in! Now just finish registering here and you'll be all set. [pending]</p>}
                {(userdata.status == 'signedout') && <p>Please sign in to register.</p>}
                {((userdata.status == 'registered') || (userdata.status == 'active')) && <p>You're already registered. Nothing to do here.</p>}
            </div>
        )
    }
}

export default Register