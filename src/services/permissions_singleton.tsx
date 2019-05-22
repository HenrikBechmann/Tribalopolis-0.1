// permissions_singleton.tsx
// copyright (c) 2019 Henritk Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import permissions from './permissions'

class permissions_singleton_class {

    private callbackindex = 0
    private activeaccountdata 
    private activememberdata
    public contextAccountReference
    public contextControlData

    private callbacks = new Map()


    public updateControlData = ({
        systemdata,
        userdata,
        activeaccountreference,
        stateaccountreference,
        callbackindex,
    }) => {

        if (this.contextAccountReference && this.activeaccountdata && this.activememberdata) {
            this.callbacks.get(callbackindex)()
        } else {
            this.permissions.updateControlData(
                {
                    systemdata,
                    userdata,
                    activeaccountreference,
                    stateaccountreference,
                }
            )
        }
    }

    public registerCallback = (callback) => {
        let index = this.callbackindex++
        this.callbacks.set(index,callback)
        // if (this.contextAccountReference) callback()
        return index
    }

    public deRegisterCallback = (index) => {
        this.callbacks.delete(index)
    }

    private doCallback = (callback) => {
        callback()
    }

    private doCallbacks = () => {
        this.callbacks.forEach(this.doCallback)
    }

    private onPermissions = () => {

        let contextcontroldata = this.permissions.contextControlData
        // console.log('onPermissions',contextcontroldata)

        // Object.assign is used to trigger update in children
        this.activeaccountdata = contextcontroldata.activeaccountdata
        this.activememberdata = contextcontroldata.activememberdata
        this.contextAccountReference = this.permissions.contextAccountReference
        this.contextControlData = contextcontroldata

        this.doCallbacks()

    }

    private permissions = new permissions(this.onPermissions)

}

const permissions_singleton = new permissions_singleton_class()

export default permissions_singleton