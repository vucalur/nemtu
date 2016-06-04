import {requireAuth} from '../account/auth/routingResolvers.js';

export function routerConfig($stateProvider) {
  'ngInject';
  $stateProvider
    .state('engines', {
      url: '/engines',
      templateUrl: 'app/components/engines/list.html',
      controller: 'ListController',
      controllerAs: 'vm',
      resolve: {user: requireAuth}
    });
}
