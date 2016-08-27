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
    this.AuthService.login(providerCode).then(authData => {
      this.$log.log("Logged in as:", authData.user.uid);
      this.$state.go('channels');
    }).catch(error => {
      this.$log.error("Authentication failed:", error);
    });
  }
}

export default {
  templateUrl: 'app/account/login/login.html',
  controller: LoginController,
  controllerAs: 'vm'
};
