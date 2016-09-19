export default function states($stateProvider) {
  'ngInject';
  $stateProvider
    .state({
      name: 'channels',
      url: '/',
      component: 'channels',
      data: {requiresAuth: true}
    })
    .state({
      name: 'channels.channel',
      url: 'channel/{channelId}',
      component: 'channel'
    });
}
