import firebase from 'firebase';

export function config($logProvider) {
  'ngInject';
  $logProvider.debugEnabled(true);

  const firebaseAddresses = {
    apiKey: "AIzaSyBl7xhaxi6SW4fQE6uK2DdVzV0VFTEZaRE",
    authDomain: "nemtu-vuc.firebaseapp.com",
    databaseURL: "https://nemtu-vuc.firebaseio.com",
    storageBucket: "nemtu-vuc.appspot.com"
  };
  firebase.initializeApp(firebaseAddresses);
}

export function urlsConfig($urlRouterProvider, $locationProvider) {
  'ngInject';
  $locationProvider.html5Mode(false);
  $urlRouterProvider.otherwise('/');
}
