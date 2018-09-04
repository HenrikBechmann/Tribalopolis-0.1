// firebaseui.api.tsx
import firebase from './firebase.api';
// import * as firebaseui from 'firebaseui'
let provider = new firebase.auth.GoogleAuthProvider();
let googlesignin = () => {
    console.log('current user BEFORE signin', firebase.auth().currentUser);
    firebase.auth().signInWithRedirect(provider).then((result) => {
        console.log('signed in ', result);
        firebase.auth().getRedirectResult().then((result) => {
            console.log('redirect result', result);
            console.log('current user AFTER signin', firebase.auth().currentUser);
        });
    }).catch((error) => {
        console.log('error signing in', error);
    });
};
let googlesignout = () => {
    console.log('current user on signout', firebase.auth().currentUser);
    return firebase.auth().signOut().then((result) => {
        console.log('signed out', result);
        console.log('current AFTER signout', firebase.auth().currentUser);
        return 'signed out';
    }).catch((error) => {
        console.log('error signing out', error);
        return error;
    });
};
let getRedirectResult = () => {
    return firebase.auth().getRedirectResult().then(function (result) {
        let token;
        let user;
        if (result.credential) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            token = result.credential.accessToken;
            // ...
        }
        // The signed-in user info.
        user = result.user;
        return { token, user };
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        return { error: {
                errorCode,
                errorMessage,
                email,
                credential,
            } };
        // ...
    });
};
let authapi = {
    googlesignin,
    googlesignout,
    getRedirectResult,
};
export default authapi;
//# sourceMappingURL=firebaseui.api.jsx.map