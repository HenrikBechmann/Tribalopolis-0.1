// permissions_singleton.tsx
// copyright (c) 2019 Henritk Bechmann, Toronto, Licence: GPL-3.0-or-later

/*
    this is used exclusively by useraccount permission data
*/

'use strict'

import fetchactivepermissions from './fetchactivepermissions'

class useraccount_permissions_cache_class {

    private callbackindex = 0
    private activeaccountdata 
    private activememberdata
    public contextAccountReference
    public contextControlData

    private callbacks = new Map()


    public updateControlData = (parms) => {

        let {
            systemdata,
            userdata,
            activeaccountreference,
            stateaccountreference,
            callbackindex,
        } = parms

        if ((activeaccountreference == stateaccountreference) && this.contextAccountReference && this.activeaccountdata && this.activememberdata) {
            this.callbacks.get(callbackindex)() // run the callback
        } else {
            this.fetchactivepermissions.updateControlData(
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

    private onFetchPermissions = (contextcontroldata) => {

        // let contextcontroldata = this.fetchactivepermissions.contextControlData

        // Object.assign is used to trigger update in registrants
        this.activeaccountdata = Object.assign({},contextcontroldata.activeaccountdata)
        this.activememberdata = Object.assign({},contextcontroldata.activememberdata)
        this.contextAccountReference = this.fetchactivepermissions.contextAccountReference
        this.contextControlData = {
            activeaccountdata:this.activeaccountdata,
            activememberdata:this.activememberdata,
        }

        this.doCallbacks()

    }

    private fetchactivepermissions = new fetchactivepermissions(this.onFetchPermissions)

}

const useraccount_permissions_cache = new useraccount_permissions_cache_class()

export default useraccount_permissions_cache