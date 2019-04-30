// controldata.context.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

import UserDataContext from '../services/userdata.context'
import SystemDataContext from '../services/systemdata.context'

const ControlDataContext = (props) => {

    let {activemember, activeaccount} = props // TODO: switch to activememperproxy?

    return <SystemDataContext.Consumer>
        {systemdata => (
            <UserDataContext.Consumer>
                {userdata => (
                    props.children( systemdata, userdata, activemember, activeaccount )
                )}
            </UserDataContext.Consumer>
        )}
    </SystemDataContext.Consumer>

}

export default ControlDataContext