// useraccount.permissiondata.tsx
// copyright (c) 2019 Henritk Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

import useraccount_active_permissions_cache from './useraccount.activepermissions.cache'

// TODO: check for race conditions

class UserAccountActivePermissionsData extends React.Component<any,any> {

    state = {
        generation:0,
        accountreference:null,
    }

    activeaccountdata = null
    activememberdata = null

    callbackindex = null

    constructor(props) {
        super(props)
        this.callbackindex = useraccount_active_permissions_cache.registerCallback(this.onCachePermissions)
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

        // console.log('active.data didMOUNT',userdata.status,callparms)

        useraccount_active_permissions_cache.updateControlData(callparms)
    }

    componentDidUpdate() {
        let { userdata } = this.props
        let activeaccountreference = (userdata.status == 'active')?userdata.accountpack.reference:null

        let callparms = {
            systemdata:this.props.systemdata,
            userdata,
            activeaccountreference,
            // stateaccountreference:this.state.accountreference,
            callbackindex:this.callbackindex
        }
        // console.log('active.data didUPDATE',userdata.status,callparms)

        useraccount_active_permissions_cache.updateControlData(callparms)
    }

    unmounting = false

    componentWillUnmount() {

        this.unmounting = true
        useraccount_active_permissions_cache.deRegisterCallback(this.callbackindex)
    }

    onCachePermissions = () => {
        let contextcontroldata = useraccount_active_permissions_cache.contextControlData
        // console.log('onCachePermissions',contextcontroldata)
        if (Object.is(this.activeaccountdata, contextcontroldata.activeaccountdata)
            && Object.is(this.activememberdata,contextcontroldata.activememberdata)
            && this.state.accountreference == useraccount_active_permissions_cache.activeAccountReference)
        {
            return
        }
        this.activeaccountdata = contextcontroldata.activeaccountdata 
        this.activememberdata = contextcontroldata.activememberdata 

        if (this.unmounting) return
        this.setState((state) => ({
            generation:++state.generation,
            accountreference:useraccount_active_permissions_cache.activeAccountReference,
        }))

    }

    render() {

        let children:any = this.props.children // children expected to be a function not a ReactNode

        return children(this.activeaccountdata, this.activememberdata)

    }

}

export default UserAccountActivePermissionsData