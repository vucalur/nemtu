export function requireAuth(authService) {
  'ngInject';

  return authService._firebaseAuth.$requireAuth();
}
