class NavbarController {
  constructor($state, AuthService) {
    'ngInject';
    this.$state = $state;
    this.AuthService = AuthService;
  }

  logout() {
    this.AuthService.logout();
    this.$state.go('login');
  }

  get displayName() {
    return this.AuthService.displayName;
  }

  get isLoggedIn() {
    return this.AuthService.isLoggedInSync();
  }
}

export default {
  template: require('./navbar.component.html'),
  controller: NavbarController,
  controllerAs: 'vm',
  bindings: {
    toggleSidenav: '&?'
  }
};
