export default function states($stateProvider) {
  'ngInject';
  $stateProvider
    .state({
      name: 'login',
      url: '/login',
      component: 'login'
    });
}
