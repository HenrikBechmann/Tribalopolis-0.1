// controldata.context.tsx
// copyright (c) 2019 Henritk Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

import UserDataContext from '../services/userdata.context'
import SystemDataContext from '../services/systemdata.context'


// PLACEHOLDERS...
const getActiveMemberData = (systemdata, userdata, activemember, activeaccount) => {
    // TODO fetch activememberdata from cache or from db
    if (!activemember) {
        return null
    } else {
        return activemember
    }
}

const getActiveAccountData = (systemdata, userdata, activemember, activeaccount) => {
    // TODO fetch activeaccountdata from cache or from db
    if (!activeaccount) {
        return userdata
    } else {
        return activeaccount // as found in database or cache
    }
}
// END OF PLACEHOLDERS


const ControlData = (props) => {

    let {activemember, activeaccount} = props // TODO: switch to activememperproxy?

    return <SystemDataContext.Consumer>
        {systemdata => (
            <UserDataContext.Consumer>
                {userdata => (
                    props.children( 
                        systemdata, 
                        userdata, 
                        getActiveMemberData(systemdata, userdata, activemember, activeaccount), 
                        getActiveAccountData(systemdata, userdata, activemember, activeaccount)
                    )
                )}
            </UserDataContext.Consumer>
        )}
    </SystemDataContext.Consumer>

}

export default ControlData