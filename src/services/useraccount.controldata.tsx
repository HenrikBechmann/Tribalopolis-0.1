// controldata.context.tsx
// copyright (c) 2019 Henritk Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React, {useState} from 'react'

import UserDataContext from './userdata.context'
import SystemDataContext from './systemdata.context'

const UserAccountControlData = (props) => {

    let activeaccountdata = null, activememberdata = null

    return <SystemDataContext.Consumer>

        {systemdata => (
            
            <UserDataContext.Consumer>

                {(userdata) => {

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