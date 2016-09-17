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
      component: 'channel',
      resolve: {
        channel: (user, $transition$, Channels) => {
          const firebaseObj = Channels.getChannel(user.uid, $transition$.params().channelId);
          // TODO(vucalur): performance: don't wait with loading the rest of the app. Returning promise here blocks entire UI
          return firebaseObj.$loaded(); // return promise
        }
      }
    });
}
