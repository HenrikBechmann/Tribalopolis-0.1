// functions.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import firebase from './firebase.api'

let firestore = firebase.firestore()

const now = firebase.firestore.Timestamp.now

const handleFromEmail = parms => {
    let {email} = parms
    let parts = email.split('@')
    return parts[0]
}

const incomingdatefilter = (date) => {
    return null
}

const outgoingdatefilter = (date) => {
    return null
}

const functions = {
    now,
    handleFromEmail,
    incomingdatefilter,
    outgoingdatefilter,
}

export default functions