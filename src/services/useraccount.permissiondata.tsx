// useraccount.permissiondata.tsx
// copyright (c) 2019 Henritk Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

import permissions from './permissions'

// TODO: check for race conditions

class UserAccountPermissionData extends React.Component<any,any> {

    state = {
        generation:0,
        accountreference:null,
    }

    activeaccountdata = null
    activememberdata = null

    permissions:permissions = null

    constructor(props) {
        super(props)
        this.permissions = new permissions(this.onPermissions)
    }

    componentDidMount() {
        let activeaccountreference = this.props.userdata?this.props.userdata.accountpack.reference:null
        // console.log('userAccountPermissionData componentDidMount, activeaccountrefreence',activeaccountreference, this.state.accountreference)
        this.permissions.updateControlData({
            systemdata:this.props.systemdata,
            userdata:this.props.userdata,
            activeaccountreference,
            stateaccountreference:this.state.accountreference
        })
    }

    componentDidUpdate() {
        let activeaccountreference = this.props.userdata?this.props.userdata.accountpack.reference:null
        // console.log('userAccountPermissionData componentDidUpdate, activeaccountreference',activeaccountreference, this.state.accountreference)
        this.permissions.updateControlData({
            systemdata:this.props.systemdata,
            userdata:this.props.userdata,
            activeaccountreference,
            stateaccountreference:this.state.accountreference
        })
    }

    onPermissions = () => {
        let contextcontroldata = this.permissions.contextControlData
        // console.log('onPermissions',contextcontroldata)

        // Object.assign is used to trigger update in children
        this.activeaccountdata = Object.assign({},contextcontroldata.activeaccountdata)
        this.activememberdata = Object.assign({}, contextcontroldata.activememberdata)
        this.setState((state) => ({
            generation:++state.generation,
            accountreference:this.permissions.contextAccountReference,
        }))
    }

    render() {

        let children:any = this.props.children // children expected to be a function not a ReactNode

        return children(this.activeaccountdata, this.activememberdata)

    }

}

export default UserAccountPermissionData