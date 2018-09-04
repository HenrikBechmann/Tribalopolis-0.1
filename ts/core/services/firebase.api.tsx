// firebase.api.tsx

import firebase from 'firebase/app'

// import 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

// Initialize Firebase
let config = {
apiKey: "AIzaSyAac-N-SN0l2wGc4Peys_jB2qgzoQfQSqw",
authDomain: "tribalopolis.firebaseapp.com",
databaseURL: "https://tribalopolis.firebaseio.com",
projectId: "tribalopolis",
storageBucket: "tribalopolis.appspot.com",
messagingSenderId: "547793952145"
}

firebase.initializeApp(config)

export default firebase