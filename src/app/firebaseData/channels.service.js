// TODO(vucalur): DRY: Engines, Channels
export default class Channels {
  constructor($firebaseArray, $firebaseObject, Root) {
    'ngInject';

    this.$firebaseArray = $firebaseArray;
    this.$firebaseObject = $firebaseObject;
    this.Root = Root;
    this.channels = null;
  }

  getChannels(uid) {
    if (!this.channels) {
      const channelsRef = this.Root.uChannels.child(uid);
      this.channels = this.$firebaseArray(channelsRef);
    }
    return this.channels;
  }

  getChannelPromise(uid, channelId) {
    const ref = this.Root.uChannels.child(uid).child(channelId);
    const firebaseObj = this.$firebaseObject(ref);
    return firebaseObj.$loaded();
  }
}
