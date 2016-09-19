import {requireAuth} from '../account/auth/routingResolvers';

export function routerConfig($stateProvider) {
  'ngInject';
  $stateProvider
    .state({
      name: 'channels',
      url: '/',
      component: 'channels',
      resolve: {user: requireAuth}
    })
    .state({
      name: 'channels.channel',
      url: 'channel/{channelId}',
      component: 'channel'
    });
}
