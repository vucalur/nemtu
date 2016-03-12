export function routerConfig($stateProvider) {
  'ngInject';
  $stateProvider
    .state('articles', {
      url: '/articles',
      templateUrl: 'app/components/feed/articles.html',
      controller: 'ArticlesController',
      controllerAs: 'vm'
    });
}
