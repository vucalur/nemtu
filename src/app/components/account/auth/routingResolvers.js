export function requireAuth(authService) {
  'ngInject';

  return authService.requireSignIn();
}
