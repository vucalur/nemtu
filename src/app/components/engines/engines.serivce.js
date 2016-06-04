export class EnginesService {
  constructor($firebaseArray, firebaseDataService) {
    'ngInject';

    this.$firebaseArray = $firebaseArray;
    this.firebaseDS = firebaseDataService;
    this.engines = null;
  }

  getEnginesByUser(uid) {
    if (!this.engines) {
      var enginesRef = this.firebaseDS.users.child(uid).child('engines');
      this.engines = this.$firebaseArray(enginesRef);
    }
    return this.engines;
  }
}
