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

const incomingDateFilter = (date:firebase.firestore.Timestamp) => {

    if (date === null) return date

    try {

        return date.toDate()

    } catch(e) {

        console.error( 'system:improper incoming date conversion', date, e )
        return null

    }

}

const outgoingDateFilter = (date:Date) => {

    if (date === null) return date

    try {

        return firebase.firestore.Timestamp.fromDate(date)
    } catch (e) {

        console.error( 'system:improper outgoing date conversion', date, e )
        return null

    }

}

const functions = {
    now,
    handleFromEmail,
    incomingDateFilter,
    outgoingDateFilter,
}

export default functions