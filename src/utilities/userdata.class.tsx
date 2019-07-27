// docproxy.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later
'use strict'

class Userdata {
    login = null
    userpack = null
    usertype = null
    accountpack = null
    accounttype = null

    get isloggedin() {
        return !!this.login
    }

    get status() {
        if (this.userpack) {
            if (this.userpack.document.control_status == 'active') {
                return 'active'
            } else {
                return 'registered'
            }
        }
        if (this.login) {
            return 'loggedin'
        }
        return 'signedout'
    }
}

export default Userdata