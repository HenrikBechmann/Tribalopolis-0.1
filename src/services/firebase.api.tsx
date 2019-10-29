// firebase.api.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import firebase from 'firebase/app'

// import 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

// Initialize Firebase
let config = {
    apiKey: "AIzaSyAac-N-SN0l2wGc4Peys_jB2qgzoQfQSqw",
    authDomain: "tribalopolis.com",//"tribalopolis.firebaseapp.com",
    databaseURL: "https://tribalopolis.firebaseio.com",
    projectId: "tribalopolis",
    storageBucket: "tribalopolis.appspot.com",
    messagingSenderId: "547793952145"
}

firebase.initializeApp(config)

// Disable deprecated features
// required according to https://firebase.google.com/docs/firestore/quickstart
// no longer required as of version 5.8.0
// firebase.firestore().settings({
//   timestampsInSnapshots: true
// })

export default firebase