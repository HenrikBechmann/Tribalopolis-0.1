// permissions_singleton.tsx
// copyright (c) 2019 Henritk Bechmann, Toronto, Licence: GPL-3.0-or-later

/*
    this is used exclusively by useraccount permission data
*/

'use strict'

import fetchactivepermissions from './fetchactivepermissions'

class useraccount_active_permissions_cache_class {

    public activeAccountReference
    public contextControlData

    private callbackindex = 0
    private activeaccountdata 
    private activememberdata

    private callbacks = new Map()


    public updateControlData = (parms) => {

        let {
            systemdata,
            userdata,
            activeaccountreference,
            // stateaccountreference,
            callbackindex,
        } = parms

        // console.log('cache',activeaccountreference,this.activeAccountReference, this.activeaccountdata,this.activememberdata)
        if ((activeaccountreference  == this.activeAccountReference) && this.activeaccountdata && this.activememberdata) {
            this.callbacks.get(callbackindex)() // run the callback
        } else {
            this.fetchactivepermissions.updateControlData(
                {
                    systemdata,
                    userdata,
                    activeaccountreference,
                    stateaccountreference:null,
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

    private onFetchPermissions = () => {

        let contextcontroldata = this.fetchactivepermissions.contextControlData

        // Object.assign is used to trigger update in registrants
        this.activeaccountdata = Object.assign({},contextcontroldata.activeaccountdata)
        this.activememberdata = Object.assign({},contextcontroldata.activememberdata)
        this.activeAccountReference = this.fetchactivepermissions.contextAccountReference
        this.contextControlData = {
            activeaccountdata:this.activeaccountdata,
            activememberdata:this.activememberdata,
        }

        this.doCallbacks()

    }

    private fetchactivepermissions = new fetchactivepermissions(this.onFetchPermissions)

}

const useraccount_active_permissions_cache = new useraccount_active_permissions_cache_class()

export default useraccount_active_permissions_cache