import {requireAuth} from '../account/auth/routingResolvers';

export function routerConfig($stateProvider) {
  'ngInject';
  $stateProvider
    .state({
      name: 'engines',
      url: '/engines',
      component: 'engines',
      resolve: {user: requireAuth}
    });
}
