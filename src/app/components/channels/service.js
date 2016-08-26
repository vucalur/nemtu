export default class Channels {
  constructor($firebaseArray, $firebaseObject, FirebaseData) {
    'ngInject';

    this.$firebaseArray = $firebaseArray;
    this.$firebaseObject = $firebaseObject;
    this.FirebaseData = FirebaseData;
    this.channels = null;
  }

  getChannels(uid) {
    if (!this.channels) {
      const ref = this.FirebaseData.uChannels.child(uid);
      this.channels = this.$firebaseArray(ref);
    }
    return this.channels;
  }

  getChannel(uid, channelId) {
    const ref = this.FirebaseData.uChannels.child(uid).child(channelId);
    return this.$firebaseObject(ref);
  }
}
