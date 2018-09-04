// firebase.api.tsx
import * as firebase from 'firebase';
import 'firebase/firestore';
// Initialize Firebase
let config = {
    apiKey: "AIzaSyAac-N-SN0l2wGc4Peys_jB2qgzoQfQSqw",
    authDomain: "tribalopolis.firebaseapp.com",
    databaseURL: "https://tribalopolis.firebaseio.com",
    projectId: "tribalopolis",
    storageBucket: "tribalopolis.appspot.com",
    messagingSenderId: "547793952145"
};
firebase.initializeApp(config);
export default firebase;
//# sourceMappingURL=firebase.api.jsx.map