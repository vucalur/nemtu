import angular from "angular";
import {pluralOrSingular} from "../utils";

/**
 * Separate service instance for each channel, to avoid constant passing channelId in call hierarchy
 * and to manage states of pagination cursors.
 */
class Articles_ScopePrototype {
  constructor($log, $q, Paged, Root, AuthService, channelId) {
    this.$log = $log;
    this.$q = $q;
    this.channelId = channelId;
    this._ref = Root.ucArticles.child(AuthService.uid).child(this.channelId);
    this._readRef = this._ref.child('read');
    this._unreadRef = this._ref.child('unread');
    this._readPaged = Paged.createInstance(this._readRef);
    this._unreadPaged = Paged.createInstance(this._unreadRef);
  }

  unreadNextPage() {
    return this._unreadPaged.getNextPage();
  }

  readNextPage() {
    return this._readPaged.getNextPage();
  }

  // TODO(vucalur): Why "filterOnlyNew = articles => {" ain't compiling ?!
  filterOnlyNew(articles) {
    const mapId2Article = this._mapId2Article(articles);

    return this._filterOut(this._readRef, mapId2Article)
      .then(() => this._filterOut(this._unreadRef, mapId2Article))
      .then(() => {
        const onlyNewArticles = this._extractArticles(mapId2Article);
        this.$log.info(`After filtering out articles fetched earlier, ${onlyNewArticles.length} article${pluralOrSingular(onlyNewArticles)} left`);
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
      // TODO(vucalur): Magic number (listingId). ES6 Enums? http://exploringjs.com/es6/ch_symbols.html ?
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

  addScraped(articles) {
    Articles_ScopePrototype._setDatetimeScraped(articles);
    return this._unreadPaged.addOmittingPagination(...articles);
  }

  markAsRead(article) {
    // removal will not affect pagination since article has already been fetched if this method is invoked
    this._removeUnread(article);
    this._readPaged.addOmittingPagination(article);
  }

  _removeUnread(article) {
    this._unreadRef.child(article.$key).remove();
  }

  static _setDatetimeScraped(articles) {
    const datetimeScraped = Date.now();
    articles.forEach(article => {
      article.datetimeScraped = datetimeScraped;
    });
  }
}

export default class Articles {
  constructor($log, $q, Paged, Root, AuthService) {
    'ngInject';
    this.createInstance = channelId =>
      new Articles_ScopePrototype($log, $q, Paged, Root, AuthService, channelId);
  }
}

