// docproxy.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later
'use strict'

class Userdata {
    login = null
    userpack = null
    userclaimspack = null
    usertype = null
    accountpack = null
    accounttype = null

    get isloggedin() {
        return !!this.login
    }

    get status() {
        if (this.accountpack) {
            // if (this.userclaimspack && (this.userclaimspack.document.status == 'active')) {
            if (this.userclaimspack && (this.userclaimspack.document.status == 'active')) {
                return 'active'
            }
            return 'registered'
        }
        if (this.userpack) {
            return 'registered-user'
        }
        if (this.login) {
            return 'loggedin'
        }
        return 'signedout'
    }
    get globalrole() {
        // if (this.userclaimspack && this.userclaimspack.document.globalrole) {
        if (this.userclaimspack?.document.globalrole) {
            return this.userclaimspack.document.globalrole
        } else {
            return undefined
        }
    }
}

export default Userdata