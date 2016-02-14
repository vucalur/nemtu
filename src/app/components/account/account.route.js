export function routerConfig($stateProvider) {
  'ngInject';
  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'app/components/account/login/login.html',
      controller: 'LoginController',
      controllerAs: 'vm'
    });
}
