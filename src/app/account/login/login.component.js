class LoginController {
  constructor($log, $state, AuthService) {
    'ngInject';

    this.$log = $log;
    this.$state = $state;
    this.AuthService = AuthService;
    this._providers = [
      {icon: 'google-plus', text: 'Google plus', code: 'google'},
      {icon: 'github-circle', text: 'GitHub', code: 'github'},
      {icon: 'facebook', text: 'Facebook - TODO', code: 'facebook'},
      {icon: 'twitter', text: 'Twitter - TODO', code: 'twitter'}
    ];
  }

  get providers() {
    return this._providers;
  }

  login(providerCode) {
    this.AuthService.login(providerCode)
      .then(() => this.$log.log("Logged in. uid:", this.AuthService.uid))
      // TODO(vucalur): redirect to previous state
      // TODO(vucalur): show error in UI
      .catch(error => this.$log.error("Authentication failed:", error));
  }
}

export default {
  template: require('./login.component.html'),
  controller: LoginController,
  controllerAs: 'vm'
};
