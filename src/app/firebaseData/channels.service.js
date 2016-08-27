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
      const ref = this.Root.uChannels.child(uid);
      this.channels = this.$firebaseArray(ref);
    }
    return this.channels;
  }

  getChannel(uid, channelId) {
    const ref = this.Root.uChannels.child(uid).child(channelId);
    return this.$firebaseObject(ref);
  }
}
