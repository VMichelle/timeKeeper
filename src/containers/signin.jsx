import React, { useEffect, useState } from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase/app';
import { firebaseConfig } from '../config';
import { Button } from 'react-bootstrap';

const SignInScreen = () => {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    };

    const [isSignedIn, setIsSignedIn] = useState(false);

    useEffect(() => {
        const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
            setIsSignedIn(!!user);
          });
          return () => unregisterAuthObserver();
    }, [])

    const uiConfig = {
        callbacks: {
            signInSuccessWithAuthResult: function(authResult, redirectUrl) {
                return true;
            }
        },
        signInFlow: 'popup',
        signInSuccessUrl: '/report',
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.EmailAuthProvider.PROVIDER_ID
        ],
        tosUrl: '<your-tos-url>',
        privacyPolicyUrl: '<your-privacy-policy-url>'
    };

    if (!isSignedIn) {
        return (
          <div className='p-3 mt-5 d-flex flex-column justify-content-center'>
            <div className='d-flex justify-content-center'>Please sign-in</div>
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
          </div>
        );
      }
      return (
        <div className='p-3 mt-5 d-flex flex-column'>
            <div className='d-flex justify-content-center'>Welcome {firebase.auth().currentUser.displayName}! You are now signed-in!</div>
            <div className='d-flex justify-content-center mt-3'>
                <Button onClick={() => firebase.auth().signOut()}>Sign-out</Button>
            </div>
        </div>
      );
};

export default SignInScreen;
