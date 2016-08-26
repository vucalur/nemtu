export default class EnginesService {
  constructor($firebaseArray, FirebaseData) {
    'ngInject';

    this.$firebaseArray = $firebaseArray;
    this.FirebaseData = FirebaseData;
    this.engines = null;
  }

  getEnginesByUser(uid) {
    if (!this.engines) {
      const enginesRef = this.FirebaseData.uEngines.child(uid);
      this.engines = this.$firebaseArray(enginesRef);
    }
    return this.engines;
  }
}
