export default class Channels {
  constructor($firebaseArray, FirebaseData) {
    'ngInject';

    this.$firebaseArray = $firebaseArray;
    this.FirebaseData = FirebaseData;
    this.channels = null;
  }

  getChannelsByUser(uid) {
    if (!this.channels) {
      const ref = this.FirebaseData.uChannels.child(uid);
      this.channels = this.$firebaseArray(ref);
    }
    return this.channels;
  }
}
