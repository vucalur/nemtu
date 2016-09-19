import angular from "angular";
import DynamicArticles from "./dynamicArticles";
import {pluralOrSingular} from "../../utils";

class ChannelController {
  constructor($log, $scope, $mdToast, Engines, Channels, Articles, Crawler) {
    'ngInject';

    this.$mdToast = $mdToast;
    const channelId = this.$transition$.params().channelId;
    Channels.getChannelPromise(this.user.uid, channelId)
      .then(channel => {
        this.channel = channel;
        Engines.getEnginePromise(this.user.uid, this.channel.engine_id)
          .then(engine => {
            this.engine = engine;
            this.CrawlerInstance = Crawler.createInstance(this.channel.url, this.engine);
          });
      });
    this.ArticlesInstance = Articles.createInstance(this.user.uid, channelId);
    this.dynamicArticles = new DynamicArticles($log, this.ArticlesInstance);
    this._registerMarkReadOnScroll($scope);
  }

  _registerMarkReadOnScroll($scope) {
    $scope.$watch('vm.topIndex', newVal => {
      this.dynamicArticles.markRead(newVal);
    });
  }

  fetch() {
    const artiInst = this.ArticlesInstance;
    const da = this.dynamicArticles;

    // TODO(vucalur): Not liking this bind() mess. Why ES6's "filterOnlyNew = articles => {" ain't compiling ?!
    this.CrawlerInstance.fetchArticles()
      .then(angular.bind(artiInst, artiInst.filterOnlyNew))
      .then(angular.bind(artiInst, artiInst.addScraped))
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
    user: '<',
    $transition$: '<'
  }
};
