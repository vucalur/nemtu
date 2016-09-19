// TODO(vucalur): DRY: Engines, Channels
export default class Engines {
  constructor($firebaseArray, $firebaseObject, Root, AuthService) {
    'ngInject';

    this.$firebaseArray = $firebaseArray;
    this.$firebaseObject = $firebaseObject;
    this.Root = Root;
    this.AuthService = AuthService;
    this.engines = null;
  }

  getEngines() {
    if (!this.engines) {
      const uid = this.AuthService.uid;
      const enginesRef = this.Root.uEngines.child(uid);
      this.engines = this.$firebaseArray(enginesRef);
    }
    return this.engines;
  }

  getEnginePromise(engineId) {
    const uid = this.AuthService.uid;
    const ref = this.Root.uEngines.child(uid).child(engineId);
    const firebaseObj = this.$firebaseObject(ref);
    return firebaseObj.$loaded();
  }
}
