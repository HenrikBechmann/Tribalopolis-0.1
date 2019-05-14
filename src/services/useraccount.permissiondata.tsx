// useraccount.permissiondata.tsx
// copyright (c) 2019 Henritk Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

class UserAccountPermissionData extends React.Component<any,any> {

    activeaccountdata = null
    activememberdata = null

    render() {

        let children:any = this.props.children // children expected to be a function not a ReactNode

        return children(this.activeaccountdata, this.activememberdata)

    }

}

export default UserAccountPermissionData