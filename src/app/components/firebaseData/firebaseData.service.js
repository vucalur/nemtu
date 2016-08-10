import Firebase from 'firebase';

export default class FirebaseDataService {
  constructor(FIREBASE_URL) {
    'ngInject';
    const root = new Firebase(FIREBASE_URL);

    this.root = root;
    this.users = root.child('users');
  }
}
