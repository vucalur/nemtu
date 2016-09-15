export function routesConfig($urlRouterProvider, $locationProvider) {
  'ngInject';
  $locationProvider.html5Mode(false);
  $urlRouterProvider.otherwise('/');
}

export function authRequiredRedirect($rootScope, $state) {
  'ngInject';
  $rootScope.$on("$stateChangeError", (event, toState, toParams, fromState, fromParams, error) => {
    if (error === "AUTH_REQUIRED") {
      $state.go("login");
    }
  });
}
