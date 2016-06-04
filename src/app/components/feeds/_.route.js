export function routerConfig($stateProvider) {
  'ngInject';
  $stateProvider
    .state('main', {
      url: '/',
      templateUrl: 'app/components/feeds/channels.html',
      controller: 'ChannelsController',
      controllerAs: 'vm'
    })
    .state('articles', {
      url: '/articles',
      templateUrl: 'app/components/feeds/articles.html',
      controller: 'ArticlesController',
      controllerAs: 'vm'
    });
}
