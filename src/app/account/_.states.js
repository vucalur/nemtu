export default function states($stateProvider) {
  'ngInject';
  $stateProvider
    .state({
      name: 'login',
      url: '/login',
      component: 'login',
      resolve: {returnTo: returnTo}
    });
}

// from https://github.com/ui-router/sample-app-ng1
function returnTo($transition$) {
  'ngInject';

  if ($transition$.redirectedFrom() !== null) {
    // The user was redirected to the login state (e.g., via the requiresAuth hook)
    // Return to the original attempted target state
    return $transition$.redirectedFrom().targetState();
  }

  const $state = $transition$.router.stateService;

  // The user was not redirected to the login state; they directly activated the login state somehow.
  // Return them to the state they came from.
  if ($transition$.from().name !== '') {
    return $state.target($transition$.from(), $transition$.params("from"));
  }

  // If the fromState's name is empty, then this was the initial transition. Just return them to the channels state
  return $state.target('channels');
}
