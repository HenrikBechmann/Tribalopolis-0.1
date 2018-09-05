// firebaseui.api.tsx

import firebase from './firebase.api'

let provider = new firebase.auth.GoogleAuthProvider()

// if (firebase.auth().currentUser) {
//     firebase.auth().signOut().then((result) => {
//       console.log('triggering signup')
//       googlesignin()
//     }).catch(error => {
//       console.log('error auto logging out')
//     })   
// } else {
//   console.log('triggering getRedirectResult')
//   getRedirectResult()
// }
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log('onAuthStateChanged',user)
    getRedirectResult()
    // if (!tokenval) {
    //   googlesignout()
    //   googlesignin()
    // }
  } else {
    console.log('onAuthStateChanged blank user', user)
  }
})

const googlesignin = () => {
  console.log('signing in')
    firebase.auth().signInWithRedirect(provider)
}

const googlesignout = () => {
    if (!firebase.auth().currentUser) return
    firebase.auth().signOut().then(() => {
     console.log('signed out')
   }).catch((error) => {
     console.log('error signing out',error)
   })
}

let tokenval
let userval

function getRedirectResult() {
    firebase.auth().getRedirectResult().then(function(result:any) {
      if (result.credential) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        tokenval = result.credential.accessToken;
        // ...
      }
      // The signed-in user info.
      userval = result.user
      // return {token,user}
      console.log('getRedirectResult', userval, tokenval)
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      console.log('error of getRedirect',error)
      // return {error:{
      //     errorCode,
      //     errorMessage,
      //     email,
      //     credential,
      // }}
    });
}

let authapi = {
    googlesignin,
    googlesignout,
}

export default authapi
