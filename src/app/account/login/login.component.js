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
    const returnToOriginalState = () => {
      const state = this.returnTo.state();
      const params = this.returnTo.params();
      const options = Object.assign({}, this.returnTo.options(), {reload: true});
      this.$state.go(state, params, options);
    };

    this.AuthService.login(providerCode)
      .then(returnToOriginalState)
      // TODO(vucalur): show error in UI
      .catch(error => this.$log.error("Authentication failed:", error));
  }
}

export default {
  template: require('./login.component.html'),
  controller: LoginController,
  controllerAs: 'vm',
  bindings: {returnTo: '<'}
};
