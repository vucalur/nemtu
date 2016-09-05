import Paged from './paged';
import angular from "angular";

/**
 * Separate service instance for each channel, to avoid constant passing (uid, channelId) in call hierarchy
 * and to manage pagination cursors' states as well.
 */
class Channel_ScopePrototype {

  constructor(Root, $log, $q, uid, channelId) {
    this.Root = Root;
    this.$log = $log;
    this.$q = $q;
    this.uid = uid;
    this.channelId = channelId;
    this._ref = this.Root.ucArticles.child(this.uid).child(this.channelId);
    this._readRef = this._ref.child('read');
    this._unreadRef = this._ref.child('unread');
    this._readPaged = new Paged(this._readRef);
    this._unreadPaged = new Paged(this._unreadRef);
  }

  unreadNextPage() {
    return this._unreadPaged.getNextPage();
  }

  readNextPage() {
    return this._readPaged.getNextPage();
  }

  // TODO(vucalur): Why "filterOnlyNew = articles => {" ain't working ?!
  filterOnlyNew(articles) {
    const mapId2Article = this._mapId2Article(articles);

    return this._filterOut(this._readRef, mapId2Article)
      .then(() => this._filterOut(this._unreadRef, mapId2Article))
      .then(() => {
        const onlyNewArticles = this._extractArticles(mapId2Article);
        this.$log.info(`After filtering out articles fetched earlier, ${onlyNewArticles.length} articles left`);
        return onlyNewArticles;
      });
  }

  _extractArticles(obj) {
    // Chrome not supporting Object.values() as of v.51
    const values = [];
    angular.forEach(obj, (v, k) => values.push(v));
    return values;
  }

  _mapId2Article(articles) {
    const map = {};
    articles.forEach(a => {
      map[a.listingId] = a;
    });
    return map;
  }

  _filterOut(ref, mapId2Article) {
    const waitFor = [];
    const ids = Object.keys(mapId2Article);
    ids.forEach(id => {
      const singleFilteringDone = ref.orderByChild('listingId').equalTo(id).once('value')
        .then(snap => {
          if (snap.exists()) {
            delete mapId2Article[id];
          }
        });
      waitFor.push(singleFilteringDone);
    });

    return this.$q.all(waitFor);
  }

  addUnread(articles) {
    this._unreadPaged.addOmitPagination(articles);
  }
}

export default class Channel {
  constructor(Root, $log, $q) {
    'ngInject';
    this.createInstance = (uid, channelId) =>
      new Channel_ScopePrototype(Root, $log, $q, uid, channelId);
  }
}

