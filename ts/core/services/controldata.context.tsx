// controldata.context.tsx
// copyright (c) 2019 Henritk Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

import UserDataContext from '../services/userdata.context'
import SystemDataContext from '../services/systemdata.context'

const ControlData = (props) => {

    let {activemember, activeaccount} = props // TODO: switch to activememperproxy?

    return <SystemDataContext.Consumer>
        {systemdata => (
            <UserDataContext.Consumer>
                {(userdata) => {
                    // console.log('values collected by ControlData',systemdata, userdata, activemember, activeaccount)
                    return props.children( 
                        systemdata, 
                        userdata,
                        activemember,
                        activeaccount
                    )
                }}
            </UserDataContext.Consumer>
        )}
    </SystemDataContext.Consumer>

}

export default ControlData