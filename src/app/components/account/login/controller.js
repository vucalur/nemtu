export default class LoginController {
  constructor($log, $state, authService) {
    'ngInject';

    this.$log = $log;
    this.$state = $state;
    this._authService = authService;
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
    this._authService.login(providerCode).then(authData => {
      this.$log.log("Logged in as:", authData.uid);
      this.$state.go('main');
    }).catch(error => {
      this.$log.error("Authentication failed:", error);
    });
  }
}
