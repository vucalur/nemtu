import angular from "angular";
import {pluralOrSingular} from "../../utils";

// TODO(vucalur): Tests :)
class DynamicArticles {
  constructor($log, ChannelInstance) {
    this.$log = $log;
    // TODO(vucalur): move to app config, DRY
    this._PAGE_SIZE = 50;
    // TODO(vucalur): better way. Static const ?
    this._FETCH_IN_PROGRESS = 1234; // marker - dummy value
    this.ChannelInstance = ChannelInstance;
    this._allUnreadFetched = false;
    this._allFetched = false;
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
    return this._allFetched && index >= this._fetched.length;
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
        // TODO(vucalur): named arguments ES6
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
    const articlesWithStatus = this._articlesWithStatus(page, isRead);
    this._fetched.push(...articlesWithStatus);
  }

  _articlesWithStatus(page, isRead) {
    return page.map(article => ({data: article, isRead: isRead}));
  }

  _pageNotFull(page) {
    return page.length < this._PAGE_SIZE;
  }

  _fetchPageRead() {
    this._addFIPMarkers();
    this.ChannelInstance.readNextPage().then(page => {
      this._removeFIPMarkers();
      // TODO(vucalur): named arguments ES6
      this._addPage(page, true);
      if (this._pageNotFull(page)) {
        this._allFetched = true;
      }
    });
  }

  getLength() {
    if (this._allFetched) {
      return this._fetched.length;
    } else {
      return 50000; // arbitrarily large number
    }
  }

  markRead(index) {
    if (this._fetched.length < index) { // shouldn't ever happen, but just in case
      return;
    }
    this._markAsReadSingleUnread(index);
  }

  _markAsReadSingleUnread(index) {
    const article = this._fetched[index];
    if (article && !this._fetchInProgress(article) && !article.isRead) {
      article.isRead = true;
      this.ChannelInstance.markAsRead(article.data);
    }
  }

  /**
   * safety guaranteed by single-threaded browser's JS execution model
   */
  addOnTop(articles) {
    const articlesWithStatus = this._articlesWithStatus(articles, false);
    this._fetched.unshift(...articlesWithStatus);
    return articles;
  }
}

class ChannelController {
  constructor($log, $scope, $mdToast, Engines, Channel, Crawler) {
    'ngInject';

    this.$mdToast = $mdToast;
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
    const channel = this.ChannelInstance;
    const da = this.dynamicArticles;

    // TODO(vucalur): Not liking this bind() mess. Why ES6's "filterOnlyNew = articles => {" ain't compiling ?!
    this.CrawlerInstance.fetchArticles()
      .then(angular.bind(channel, channel.filterOnlyNew))
      .then(angular.bind(channel, channel.addScraped))
      .then(angular.bind(da, da.addOnTop))
      .then(angular.bind(this, this._showFetchCompleteToast));
  }

  _showFetchCompleteToast(articles) {
    const fetchedCount = articles.length;
    if (fetchedCount === 0) {
      this._showNoneFetchedToast();
    } else {
      this._showFetchedToast(fetchedCount);
    }
  }

  _showNoneFetchedToast() {
    const toast = this._toastCommon()
      .textContent('No new articles found');
    this.$mdToast.show(toast);
  }

  _toastCommon() {
    const toast = this.$mdToast.simple()
      .position('bottom right')
      .hideDelay(3500);
    return toast;
  }

  _showFetchedToast(fetchedCount) {
    const toast = this._toastCommon()
      .textContent(`${fetchedCount} new article${pluralOrSingular(fetchedCount)} fetched`)
      .action('Scroll the view to the top')
      .highlightAction(true)
      .highlightClass('nmt-toast-action');

    this.$mdToast.show(toast).then(response => {
      if (this._toastActionClicked(response)) {
        this.topIndex = 0;
      }
    });
  }

  _toastActionClicked(response) {
    return response === 'ok';
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
