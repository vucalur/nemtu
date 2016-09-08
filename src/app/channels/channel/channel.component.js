import angular from "angular";

class DynamicArticles {
  constructor($log, ChannelInstance) {
    this.$log = $log;
    // TODO(vucalur): move to app config, DRY
    this._PAGE_SIZE = 50;
    // TODO(vucalur): better way. Static const ?
    this._FETCH_IN_PROGRESS = 1234; // marker - dummy value
    this._LENGTH_UNKNOWN = -1; // must be negative
    this._VIEW_SIZE_IN_ARTICLES = 5;
    this._length = this._LENGTH_UNKNOWN;
    this.ChannelInstance = ChannelInstance;
    this._allUnreadFetched = false;
    this._fetched = [];
  }

  getItemAtIndex(index) {
    if (this._mdVirtualRepeatGoesCrazy(index)) {
      return;
    }

    const article = this._fetched[index];
    if (!article) {
      this._fetchPage();
    } else if (this._fetchInProgress(article)) {
      return;
    } else {
      return this._fetched[index];
    }
  }

  _mdVirtualRepeatGoesCrazy(index) {
    // … and queries indices greater than getLength() after length determined. Yup, that happens.
    // TODO(vucalur): discus this craziness on GitHub
    return this._allFetched() && index >= this._length;
  }

  _fetchInProgress(article) {
    return article === this._FETCH_IN_PROGRESS;
  }

  _fetchPage() {
    if (this._allUnreadFetched) {
      this._fetchPageRead();
    } else {
      this._addFIPMarkers();
      this.ChannelInstance.unreadNextPage().then(page => {
        this._removeFIPMarkers();
        this._addPage(page, false);
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

  _addPage(page, isRead) {
    const pageWithStatus = page.map(article => ({data: article, isRead: isRead}));
    this._fetched.push(...pageWithStatus);
  }

  _pageNotFull(page) {
    return page.length < this._PAGE_SIZE;
  }

  _fetchPageRead() {
    this._addFIPMarkers();
    this.ChannelInstance.readNextPage().then(page => {
      this._removeFIPMarkers();
      this._addPage(page, true);
      if (this._pageNotFull(page)) {
        this._markAllFetched();
      }
    });
  }

  getLength() {
    if (this._allFetched()) {
      return this._length;
    } else {
      return 50000; // arbitrarily large number
    }
  }

  _allFetched() {
    return this._length !== this._LENGTH_UNKNOWN;
  }

  _markAllFetched() {
    this._length = this._fetched.length;
  }

  markRead(index) {
    if (this._fetched.length < index) { // shouldn't ever happen, but just in case
      return;
    }
    if (this._allFetched() && this._hasScrolledToTheBottom(index)) {
      this._markAsReadAllRemainingUnread(index);
    } else {
      this._markAsReadSingleUnread(index);
    }
  }

  _hasScrolledToTheBottom(index) {
    index++;  // mdVirtualRepeat tends to sent decremented indices - crazy
    return this._length - index <= this._VIEW_SIZE_IN_ARTICLES;
  }

  _markAsReadAllRemainingUnread(index) {
    for (let i = index; i < this._length; i++) {
      this._markAsReadSingleUnread(i);
    }
  }

  _markAsReadSingleUnread(index) {
    const article = this._fetched[index];
    if (article && !this._fetchInProgress(article) && !article.isRead) {
      article.isRead = true;
      this.ChannelInstance.markAsRead(article.data);
    }
  }
}

class ChannelController {
  constructor($log, $scope, Engines, Channel, Crawler) {
    'ngInject';

    this.engine = Engines.getEngine(this.user.uid, this.channel.engine_id);
    // danger: Passing engine, which may not have been resolved from firebase yet.
    // Here works, since the only work being done is saving the reference for later use
    this.CrawlerInstance = Crawler.createInstance(this.channel.url, this.engine);
    this.ChannelInstance = Channel.createInstance(this.user.uid, this.channel.$id);
    this.dynamicArticles = new DynamicArticles($log, this.ChannelInstance);
    this._registerMarkReadOnScroll($scope);
  }

  _registerMarkReadOnScroll($scope) {
    $scope.$watch('vm.topIndex', newVal => {
      this.dynamicArticles.markRead(newVal);
    });
  }

  fetch() {
    const chi = this.ChannelInstance;

    // TODO(vucalur): Not liking this bind() mess. Why "filterOnlyNew = articles => {" ain't working ?!
    this.CrawlerInstance.fetchArticles()
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
