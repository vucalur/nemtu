import {requireAuth} from '../account/auth/routingResolvers';

export function routerConfig($stateProvider) {
  'ngInject';
  $stateProvider
    .state({
      name: 'main',
      url: '/',
      component: 'channels',
      resolve: {user: requireAuth}
    })
    .state({
      name: 'articles',
      url: '/articles',
      component: 'articles'
    });
}
