import { requireAuth } from '../account/auth/routingResolvers.js';

export function routerConfig($stateProvider) {
  'ngInject';
  $stateProvider
    .state('articles', {
      url: '/articles',
      templateUrl: 'app/components/feed/articles/articles.html',
      controller: 'ArticlesController',
      controllerAs: 'vm'
    })
    .state('engines', {
      url: '/engines',
      templateUrl: 'app/components/feed/engine/list.html',
      controller: 'ListController',
      controllerAs: 'vm',
      resolve: {user: requireAuth}
    });
}
