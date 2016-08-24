import {requireAuth} from '../account/auth/routingResolvers';

export function routerConfig($stateProvider) {
  'ngInject';
  $stateProvider
    .state('main', {
      url: '/',
      templateUrl: 'app/components/channels/list.html',
      controller: 'ChannelsController',
      controllerAs: 'vm',
      resolve: {user: requireAuth}
    })
    .state('articles', {
      url: '/articles',
      templateUrl: 'app/components/channels/articles.html',
      controller: 'ArticlesController',
      controllerAs: 'vm'
    });
}
