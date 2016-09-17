import angular from "angular";
import DynamicArticles from "./dynamicArticles";
import {pluralOrSingular} from "../../utils";

class ChannelController {
  constructor($log, $scope, $mdToast, Engines, Channel, Crawler) {
    'ngInject';

    this.$mdToast = $mdToast;
    // TODO(vucalur): move loading engine to state's resolve instead
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
    const chanInst = this.ChannelInstance;
    const da = this.dynamicArticles;

    // TODO(vucalur): Not liking this bind() mess. Why ES6's "filterOnlyNew = articles => {" ain't compiling ?!
    this.CrawlerInstance.fetchArticles()
      .then(angular.bind(chanInst, chanInst.filterOnlyNew))
      .then(angular.bind(chanInst, chanInst.addScraped))
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
  template: require('./channel.component.html'),
  controller: ChannelController,
  controllerAs: 'vm',
  bindings: {
    channel: '<',
    user: '<'
  }
};
