export default class ChannelsService {
  constructor($firebaseArray, firebaseDataService) {
    'ngInject';

    this.$firebaseArray = $firebaseArray;
    this.firebaseDS = firebaseDataService;
    this.channels = null;
  }

  getChannelsByUser(uid) {
    if (!this.channels) {
      const ref = this.firebaseDS.uChannels.child(uid);
      this.channels = this.$firebaseArray(ref);
    }
    return this.channels;
  }
}
