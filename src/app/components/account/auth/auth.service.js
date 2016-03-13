export class AuthService {
  constructor($firebaseAuth, firebaseDataService) {
    'ngInject';

    this._firebaseAuth = $firebaseAuth(firebaseDataService.root);
    this.logout = this._firebaseAuth.$unauth;
    this._watchAuthState();
  }

  _watchAuthState() {
    this._firebaseAuth.$onAuth(authData =>
      this.authData = authData
    );
  }

  isLoggedIn() {
    return this.authData;
  }

  get displayName() {
    if (!this.authData) {
      return null;
    }
    return this._parseDisplayName(this.authData);
  }

  login(providerCode) {
    return this._firebaseAuth.$authWithOAuthPopup(providerCode);
  }

  _parseDisplayName(authData) {
    var provider = authData.provider;
    return authData[provider].displayName;
  }
}
