// controldata.context.tsx
// copyright (c) 2019 Henritk Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React, {useState} from 'react'

import UserDataContext from '../../services/userdata.context'
import SystemDataContext from '../../services/systemdata.context'

const ControlData = (props) => {
    let [activeaccountname,setActiveAccount] = useState(props.activeaccount)
    let [activeaccountdata,setActiveAccountData] = useState(null) // derive this
    let [activememberdata,setActiveMemberData] = useState(null)   // serive this

    let {activeaccount:activeaccountreference} = props

    return <SystemDataContext.Consumer>
        {systemdata => (
            <UserDataContext.Consumer>
                {(userdata) => {
                    // console.log('values collected by ControlData',systemdata, userdata, activemember, activeaccount)
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

export default ControlData