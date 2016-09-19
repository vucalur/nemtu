// TODO(vucalur): DRY: Engines, Channels
export default class Channels {
  constructor($firebaseArray, $firebaseObject, Root, AuthService) {
    'ngInject';

    this.$firebaseArray = $firebaseArray;
    this.$firebaseObject = $firebaseObject;
    this.Root = Root;
    this.AuthService = AuthService;
    // TODO(vucalur): Instead of this buggy caching move all user-specific data: Engines, Articles, Channels
    // to a single data service and register onAuthChange callback there
    this.channels = null;
  }

  getChannels() {
    if (!this.channels) {
      const uid = this.AuthService.uid;
      const channelsRef = this.Root.uChannels.child(uid);
      this.channels = this.$firebaseArray(channelsRef);
    }
    return this.channels;
  }

  getChannelPromise(channelId) {
    const uid = this.AuthService.uid;
    const ref = this.Root.uChannels.child(uid).child(channelId);
    const firebaseObj = this.$firebaseObject(ref);
    return firebaseObj.$loaded();
  }
}
