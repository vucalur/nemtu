export class FirebaseDataService {
  constructor(FIREBASE_URL, Firebase) {
    'ngInject';
    var root = new Firebase(FIREBASE_URL);

    this.root = root;
    this.users = root.child('users');
  }
}
