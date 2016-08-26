export function routerConfig($stateProvider) {
  'ngInject';
  $stateProvider
    .state({
      name: 'login',
      url: '/login',
      component: 'login'
    });
}
