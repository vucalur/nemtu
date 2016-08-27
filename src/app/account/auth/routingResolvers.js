export function requireAuth(AuthService) {
  'ngInject';

  return AuthService.requireSignIn();
}
