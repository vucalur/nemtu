import firebase from 'firebase';

export default class Root {
  constructor() {
    'ngInject';
    this.root = firebase.database().ref();
    this.uEngines = this.root.child('user-engines');
    this.uChannels = this.root.child('user-channels');
    this.ucArticles = this.root.child('user-channel-articles');
  }
}
