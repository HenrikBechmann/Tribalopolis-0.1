// useraccount.controldata.tsx
// copyright (c) 2019 Henritk Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React, {useState} from 'react'

import UserDataContext from './userdata.context'
import SystemDataContext from './systemdata.context'
import UserAccountPermissionData from './useraccount.permissiondata'

const UserAccountControlData = (props) => {

    return <SystemDataContext.Consumer>

        {systemdata => (
            
            <UserDataContext.Consumer>

                {(userdata) => (

                    <UserAccountPermissionData>
                        { (activeaccountdata, activememberdata) => {
                            return props.children( 
                                systemdata, 
                                userdata,
                                activeaccountdata,
                                activememberdata,
                            )}
                        }
                    </UserAccountPermissionData>

                )}

            </UserDataContext.Consumer>
        )}
    </SystemDataContext.Consumer>

}

export default UserAccountControlData