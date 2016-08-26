class NavbarController {
  constructor($state, authService) {
    'ngInject';
    this.$state = $state;
    this._authService = authService;
  }

  logout() {
    this._authService.logout();
    this.$state.go('main');
  }

  get displayName() {
    return this._authService.displayName;
  }

  get isLoggedIn() {
    return this._authService.isLoggedIn();
  }
}

export default {
  templateUrl: 'app/components/navbar/navbar.html',
  controller: NavbarController,
  controllerAs: 'vm',
  bindings: {
    toggleSidenav: '&?'
  }
};
