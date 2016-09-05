import angular from "angular";

class DynamicArticles {
  constructor($log, ChannelInstance) {
    this.$log = $log;
    // TODO(vucalur): move to app config, DRY
    this._PAGE_SIZE = 50;
    // TODO(vucalur): better way. Static const ?
    this._FETCH_IN_PROGRESS = 1234; // marker - dummy value
    this._LENGTH_UNKNOWN = -1; // must be negative
    this._length = this._LENGTH_UNKNOWN;
    this.ChannelInstance = ChannelInstance;
    this._allUnreadFetched = false;
    this._fetched = [];
  }

  getItemAtIndex(index) {
    const article = this._fetched[index];
    if (!article) {
      this._fetchPage();
    } else if (article === this._FETCH_IN_PROGRESS) {
      return;
    } else {
      // TODO(vucalur): remove debug
      this.$log.debug(`getItemAtIndex(${index}): ${this._fetched[index].title}`);
      return this._fetched[index];
    }
  }

  _fetchPage() {
    if (this._allUnreadFetched) {
      this._fetchPageRead();
    } else {
      this._addFIPMarkers();
      this.ChannelInstance.unreadNextPage().then(page => {
        this._removeFIPMarkers();
        this._fetched.push(...page);
        if (this._pageNotFull(page)) {
          this._allUnreadFetched = true;
          this._fetchPageRead();   // if page wasn't completely empty we're fetching more than _PAGE_SIZE in a single step. Won't do harm.
        }
      });
    }
  }

  _addFIPMarkers() {
    for (let i = 0; i < this._PAGE_SIZE; i++) {
      this._fetched.push(this._FETCH_IN_PROGRESS);
    }
  }

  _removeFIPMarkers() {
    const removeStart = this._fetched.length - this._PAGE_SIZE;
    this._fetched.splice(removeStart, this._PAGE_SIZE);
  }

  _pageNotFull(page) {
    return page.length < this._PAGE_SIZE;
  }

  _fetchPageRead() {
    this._addFIPMarkers();
    this.ChannelInstance.readNextPage().then(page => {
      this._removeFIPMarkers();
      this._fetched.push(...page);
      if (this._pageNotFull(page)) {
        this._length = this._fetched.length;
      }
    });
  }

  getLength() {
    if (this._length === this._LENGTH_UNKNOWN) {
      return 50000;
    } else {
      return this._length;
    }
  }
}

class ChannelController {
  constructor($log, Engines, Channel, Crawler) {
    'ngInject';

    this.Crawler = Crawler;
    this.engine = Engines.getEngine(this.user.uid, this.channel.engine_id);
    this.ChannelInstance = Channel.createInstance(this.user.uid, this.channel.$id);
    this.dynamicArticles = new DynamicArticles($log, this.ChannelInstance);
  }

  fetch() {
    const chi = this.ChannelInstance;

    this.Crawler.fetchArticles(this.channel.url, this.engine)
      .then(angular.bind(chi, chi.filterOnlyNew))
      .then(angular.bind(chi, chi.addUnread));
  }
}

export default {
  templateUrl: 'app/channels/channel/channel.template.html',
  controller: ChannelController,
  controllerAs: 'vm',
  bindings: {
    channel: '<',
    user: '<'
  }
};
