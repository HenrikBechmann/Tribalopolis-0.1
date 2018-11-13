// functions.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence

import firebase from './firebase.api'

let firestore = firebase.firestore()

const now = firebase.firestore.Timestamp.now

const functions = {
    now,
}

export default functions