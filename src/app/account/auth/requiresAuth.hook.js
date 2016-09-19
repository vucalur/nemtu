// from https://github.com/ui-router/sample-app-ng1
export default function authHookRunBlock($transitions, AuthService) {
  'ngInject';
  const requiresAuthCriteria = {
    to: state => state.data && state.data.requiresAuth
  };

  const redirectToLogin = transition => {
    if (!AuthService.isLoggedIn()) {
      const $state = transition.router.stateService;
      return $state.target('login', undefined, {location: false});
    }
  };

  $transitions.onBefore(requiresAuthCriteria, redirectToLogin, {priority: 10});
}
