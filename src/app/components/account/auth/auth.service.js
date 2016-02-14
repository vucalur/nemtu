export class AuthService {
  constructor($firebaseAuth, firebaseDataService) {
    'ngInject';

    this._firebaseAuthObject = $firebaseAuth(firebaseDataService.root);
    this.isLoggedIn = this._firebaseAuthObject.$getAuth;
    this.logout = this._firebaseAuthObject.$unauth;
  }

  get displayName() {
    var auth = this._firebaseAuthObject.$getAuth();
    if (!auth) {
      return null;
    }
    return this._parseDisplayName(auth);
  }

  login(providerCode) {
    return this._firebaseAuthObject.$authWithOAuthPopup(providerCode);
  }

  _parseDisplayName(authData) {
    var provider = authData.provider;
    return authData[provider].displayName;
  }
}
