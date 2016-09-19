// TODO(vucalur): DRY: Engines, Channels
export default class Engines {
  constructor($firebaseArray, $firebaseObject, Root) {
    'ngInject';

    this.$firebaseArray = $firebaseArray;
    this.$firebaseObject = $firebaseObject;
    this.Root = Root;
    this.engines = null;
  }

  getEngines(uid) {
    if (!this.engines) {
      const enginesRef = this.Root.uEngines.child(uid);
      this.engines = this.$firebaseArray(enginesRef);
    }
    return this.engines;
  }

  getEnginePromise(uid, engineId) {
    const ref = this.Root.uEngines.child(uid).child(engineId);
    const firebaseObj = this.$firebaseObject(ref);
    return firebaseObj.$loaded();
  }
}
