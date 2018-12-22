// functions.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import firebase from './firebase.api'

let firestore = firebase.firestore()

const now = firebase.firestore.Timestamp.now

const functions = {
    now,
}

export default functions