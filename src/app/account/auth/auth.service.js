/**
 * According to services naming convention, it should be named and registered to angular's DI
 * as "Auth". Making it AuthService instead, to avoid confusion with Firebase's Auth
 */
// TODO(vucalur): Move "auth" folder to global ng module. Do together with general A&A overhaul
export default class AuthService {
  constructor($q, $firebaseAuth) {
    'ngInject';

    this.$q = $q;
    this._auth = $firebaseAuth();
    this._watchAuthState();
  }

  _watchAuthState() {
    const authLoadedDeferred = this.$q.defer();
    this._authLoaded = authLoadedDeferred.promise;

    this._auth.$onAuthStateChanged(user => {
      this._user = user;
      authLoadedDeferred.resolve();
    });
  }

  isLoggedIn() {
    return this._authLoaded.then(() =>
      Boolean(this._user)
    );
  }

  isLoggedInSync() {
    return Boolean(this.displayName);
  }

  get uid() {
    return this._user.uid;
  }

  get displayName() {
    return this._user && this._user.displayName;
  }

  login(providerCode) {
    const uidPromise = this._auth.$signInWithPopup(providerCode)
      .then(authData => authData.user.uid);
    return uidPromise;
  }

  logout() {
    this._auth.$signOut();
  }
}
