import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import firebase from '../utils/firebase';
import * as firebaseui from 'firebaseui';

const ui = new firebaseui.auth.AuthUI(firebase.auth());

export default () => {
  const history = useHistory();
  
  const uiConfig = {
    signInSuccessUrl: '/',
    signInOptions: [
      {
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
        forceSameDevice: false,
      },
    ],
    tosUrl: () => history.push('/terms'),
    privacyPolicyUrl: () => history.push('/privacy'),
  };

  useEffect(() => {
    ui.start('#firebaseui-auth-container', uiConfig);
  }, []);

  return <div id="firebaseui-auth-container"></div>;
}
