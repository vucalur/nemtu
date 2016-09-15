/**
 * According to services naming convention, it should be named and registered to angular's DI
 * as "Auth". Making it AuthService instead, to avoid confusion with Firebase's Auth
 */
export class AuthService {
  constructor($firebaseAuth) {
    'ngInject';

    this._auth = $firebaseAuth();
    this.logout = this._auth.$signOut;
    this.requireSignIn = this._auth.$requireSignIn;
    this._watchAuthState();
  }

  // TODO(vucalur): measure perf. benefit and use this._auth.getAuth() if marginal
  _watchAuthState() {
    this._auth.$onAuthStateChanged(user => {
      this._user = user;
    });
  }

  isLoggedIn() {
    return this._user;
  }

  get displayName() {
    if (!this._user) {
      return null;
    }
    return this._user.displayName;
  }

  login(providerCode) {
    return this._auth.$signInWithPopup(providerCode);
  }
}
