/**
 * According to services naming convention, it should be named and registered to angular's DI
 * as "Auth". Making it AuthService instead, to avoid clash with Firebase's Auth
 */
// TODO(vucalur): Move "auth" folder to global ng module. Do together with general A&A overhaul
export default class AuthService {
  constructor($q, $firebaseAuth) {
    'ngInject';

    this.$q = $q;
    this._auth = $firebaseAuth();

    // Firebase Auth needs some time from calling $firebaseAuth() to initial $onAuthStateChanged()'s callback invocation.
    // In order to prevent isLoggedIn() from returning invalid state while this time elapses:
    this._setAuthLoading();

    this._watchLoginState();
  }

  _watchLoginState() {
    this._auth.$onAuthStateChanged(user => {
      // If the auth status changes (i.e. login() or logout() is invoked) following code is performed twice:
      // first time by one of the mentioned methods, second time here.
      // It's still necessary to set auth state during application bootstrap.
      this._user = user;
      this._setAuthReady();
    });
  }

  isLoggedIn() {
    return this._authReady.then(() =>
      Boolean(this._user)
    );
  }

  /**
   * Any serious code should use async version: isLoggedIn().
   * This is just for ng-ifs, ng-shows and other promise-unaware lot
   */
  isLoggedInSync() {
    return Boolean(this._user);
  }

  get uid() {
    return this._user && this._user.uid;
  }

  get displayName() {
    return this._user && this._user.displayName;
  }

  login(providerCode) {
    // In order to prevent isLoggedIn() from returning previous state while the user is signing in,
    // invalidate _authReady:
    this._setAuthLoading();

    return this._auth.$signInWithPopup(providerCode)
      .then(authData => {
        this._user = authData.user;
        this._setAuthReady();
      });
  }

  logout() {
    // same reason as for login():
    this._setAuthLoading();

    this._auth.$signOut()
      .then(() => {
        this._user = null;
        this._setAuthReady();
      });
  }

  _setAuthLoading() {
    this._authReadyDeferred = this.$q.defer();
    this._authReady = this._authReadyDeferred.promise;
  }

  _setAuthReady() {
    this._authReadyDeferred.resolve();
  }
}
