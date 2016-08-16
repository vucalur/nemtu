import firebase from 'firebase';

export default class FirebaseDataService {
  constructor() {
    'ngInject';
    this.root = firebase.database().ref();
    this.users = this.root.child('users');
  }
}
