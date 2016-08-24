export default class EnginesService {
  constructor($firebaseArray, firebaseDataService) {
    'ngInject';

    this.$firebaseArray = $firebaseArray;
    this.firebaseDS = firebaseDataService;
    this.engines = null;
  }

  getEnginesByUser(uid) {
    if (!this.engines) {
      const enginesRef = this.firebaseDS.uEngines.child(uid);
      this.engines = this.$firebaseArray(enginesRef);
    }
    return this.engines;
  }
}
