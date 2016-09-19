/**
 * According to services naming convention, it should be named and registered to angular's DI
 * as "Auth". Making it AuthService instead, to avoid confusion with Firebase's Auth
 */
// TODO(vucalur): Move "auth" folder to global ng module. Do together with general A&A overhaul
export default class AuthService {
  constructor($firebaseAuth) {
    'ngInject';

    this._auth = $firebaseAuth();
    this.logout = this._auth.$signOut;
    this._watchAuthState();
  }

  // TODO(vucalur): measure perf. benefit and use this._auth.getAuth() if marginal
  _watchAuthState() {
    this._auth.$onAuthStateChanged(user => {
      this._user = user;
    });
  }

  isLoggedIn() {
    return Boolean(this._user);
  }

  get uid() {
    return this._user.uid;
  }

  get displayName() {
    if (!this._user) {
      return null;
    }
    return this._user.displayName;
  }

  login(providerCode) {
    const uidPromise = this._auth.$signInWithPopup(providerCode)
      .then(authData => authData.user.uid);
    return uidPromise;
  }
}
