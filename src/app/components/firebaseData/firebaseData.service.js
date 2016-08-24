import firebase from 'firebase';

export default class FirebaseDataService {
  constructor() {
    'ngInject';
    this.root = firebase.database().ref();
    this.uEngines = this.root.child('user-engines');
    this.uChannels = this.root.child('user-channels');
  }
}
