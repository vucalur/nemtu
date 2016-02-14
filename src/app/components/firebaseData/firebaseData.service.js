export class FirebaseDataService {
  constructor(FIREBASE_URL, Firebase){
    'ngInject';
    this.root = new Firebase(FIREBASE_URL);
  }
}
