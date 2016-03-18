export function runBlock($log, $rootScope, $state) {
  'ngInject';

  $rootScope.$on("$stateChangeError", (event, toState, toParams, fromState, fromParams, error) => {
    if (error === "AUTH_REQUIRED") {
      $state.go("login");
    }
  });

  $log.debug('runBlock end');
}
