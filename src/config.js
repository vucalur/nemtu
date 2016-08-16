import firebase from 'firebase';

export function config($logProvider) {
  'ngInject';
  $logProvider.debugEnabled(true);

  const config = {
    apiKey: "AIzaSyBl7xhaxi6SW4fQE6uK2DdVzV0VFTEZaRE",
    authDomain: "nemtu-vuc.firebaseapp.com",
    databaseURL: "https://nemtu-vuc.firebaseio.com",
    storageBucket: "nemtu-vuc.appspot.com"
  };
  firebase.initializeApp(config);
}
