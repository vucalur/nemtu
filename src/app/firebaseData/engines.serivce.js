export default class Engines {
  constructor($firebaseArray, Root) {
    'ngInject';

    this.$firebaseArray = $firebaseArray;
    this.Root = Root;
    this.engines = null;
  }

  getEnginesByUser(uid) {
    if (!this.engines) {
      const enginesRef = this.Root.uEngines.child(uid);
      this.engines = this.$firebaseArray(enginesRef);
    }
    return this.engines;
  }
}
