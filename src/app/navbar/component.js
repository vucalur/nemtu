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
    return this.AuthService.isLoggedIn();
  }
}

export default {
  templateUrl: 'app/navbar/navbar.html',
  controller: NavbarController,
  controllerAs: 'vm',
  bindings: {
    toggleSidenav: '&?'
  }
};
