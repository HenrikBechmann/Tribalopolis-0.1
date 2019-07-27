// useraccount.permissiondata.tsx
// copyright (c) 2019 Henritk Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

import permissions_singleton from './permissions_singleton'

// TODO: check for race conditions

class UserAccountPermissionData extends React.Component<any,any> {

    state = {
        generation:0,
        accountreference:null,
    }

    activeaccountdata = null
    activememberdata = null

    // permissions = permissions_singleton.permissions

    callbackindex = null

    constructor(props) {
        super(props)
        this.callbackindex = permissions_singleton.registerCallback(this.onPermissions)
        // this.permissions = new permissions(this.onPermissions)
    }

    componentDidMount() {
        let { userdata } = this.props
        let activeaccountreference = (userdata.status == 'active')?userdata.accountpack.reference:null

        permissions_singleton.updateControlData({
            systemdata:this.props.systemdata,
            userdata,
            activeaccountreference,
            stateaccountreference:this.state.accountreference,
            callbackindex:this.callbackindex,
        })
    }

    componentDidUpdate() {
        let { userdata } = this.props
        let activeaccountreference = (userdata.status == 'active')?this.props.userdata.accountpack.reference:null

        permissions_singleton.updateControlData({
            systemdata:this.props.systemdata,
            userdata,
            activeaccountreference,
            stateaccountreference:this.state.accountreference,
            callbackindex:this.callbackindex
        })
    }

    unmounting = false

    componentWillUnmount() {

        this.unmounting = true
        permissions_singleton.deRegisterCallback(this.callbackindex)
    }

    onPermissions = () => {
        let contextcontroldata = permissions_singleton.contextControlData
        // console.log('onPermissions',contextcontroldata)
        if (Object.is(this.activeaccountdata, contextcontroldata.activeaccountdata)
            && Object.is(this.activememberdata,contextcontroldata.activememberdata)
            && this.state.accountreference == permissions_singleton.contextAccountReference)
        {
            return
        }
        // Object.assign is used to trigger update in children
        this.activeaccountdata = contextcontroldata.activeaccountdata // Object.assign({},contextcontroldata.activeaccountdata)
        this.activememberdata = contextcontroldata.activememberdata // Object.assign({}, contextcontroldata.activememberdata)
        if (this.unmounting) return
        this.setState((state) => ({
            generation:++state.generation,
            accountreference:permissions_singleton.contextAccountReference,
        }))
    }

    render() {

        let children:any = this.props.children // children expected to be a function not a ReactNode

        return children(this.activeaccountdata, this.activememberdata)

    }

}

export default UserAccountPermissionData