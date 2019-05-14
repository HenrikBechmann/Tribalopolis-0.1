// controldata.context.tsx
// copyright (c) 2019 Henritk Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React, {useState} from 'react'

import UserDataContext from '../../services/userdata.context'
import SystemDataContext from '../../services/systemdata.context'

const UserAccountControlData = (props) => {

    let activeaccountdata = null, activememberdata = null

    return <SystemDataContext.Consumer>
        {systemdata => (
            <UserDataContext.Consumer>
                {(userdata) => {
                    // console.log('values collected by UserAccountControlData',systemdata, userdata, activemember, activeaccount)
                    return props.children( 
                        systemdata, 
                        userdata,
                        activeaccountdata,
                        activememberdata,
                    )
                }}
            </UserDataContext.Consumer>
        )}
    </SystemDataContext.Consumer>

}

export default UserAccountControlData