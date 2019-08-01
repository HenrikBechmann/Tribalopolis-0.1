// useraccount.permissiondata.tsx
// copyright (c) 2019 Henritk Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

import useraccount_permissions_cache from './useraccount_permissions_cache'

// TODO: check for race conditions

class UserAccountPermissionData extends React.Component<any,any> {

    state = {
        generation:0,
        accountreference:null,
    }

    activeaccountdata = null
    activememberdata = null

    callbackindex = null

    constructor(props) {
        super(props)
        this.callbackindex = useraccount_permissions_cache.registerCallback(this.onPermissions)
    }

    componentDidMount() {
        let { userdata } = this.props
        let activeaccountreference = (userdata.status == 'active')?userdata.accountpack.reference:null

        let callparms = {
            systemdata:this.props.systemdata,
            userdata,
            activeaccountreference,
            stateaccountreference:this.state.accountreference,
            callbackindex:this.callbackindex,
        }

        console.log('useraccount permissiondata activeaccountreference didMOUNT',userdata.status,callparms)

        useraccount_permissions_cache.updateControlData(callparms)
    }

    componentDidUpdate() {
        let { userdata } = this.props
        let activeaccountreference = (userdata.status == 'active')?userdata.accountpack.reference:null

        let callparms = {
            systemdata:this.props.systemdata,
            userdata,
            activeaccountreference,
            stateaccountreference:this.state.accountreference,
            callbackindex:this.callbackindex
        }
        console.log('useraccount permissiondata activeaccountreference didUPDATE',userdata.status,callparms)

        useraccount_permissions_cache.updateControlData(callparms)
    }

    unmounting = false

    componentWillUnmount() {

        this.unmounting = true
        useraccount_permissions_cache.deRegisterCallback(this.callbackindex)
    }

    onPermissions = () => {
        let contextcontroldata = useraccount_permissions_cache.contextControlData
        console.log('onPermissions',contextcontroldata)
        if (Object.is(this.activeaccountdata, contextcontroldata.activeaccountdata)
            && Object.is(this.activememberdata,contextcontroldata.activememberdata)
            && this.state.accountreference == useraccount_permissions_cache.contextAccountReference)
        {
            return
        }
        this.activeaccountdata = contextcontroldata.activeaccountdata 
        this.activememberdata = contextcontroldata.activememberdata 

        if (this.unmounting) return
        this.setState((state) => ({
            generation:++state.generation,
            accountreference:useraccount_permissions_cache.contextAccountReference,
        }))

    }

    render() {

        let children:any = this.props.children // children expected to be a function not a ReactNode

        return children(this.activeaccountdata, this.activememberdata)

    }

}

export default UserAccountPermissionData