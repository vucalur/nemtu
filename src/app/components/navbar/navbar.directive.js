export function NavbarDirective() {
  'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl: 'app/components/navbar/navbar.html',
    scope: {
      'toggleSidenav': '&?'
    },
    controller: NavbarController,
    controllerAs: 'vm',
    bindToController: true
  };

  return directive;
}


class NavbarController {
  constructor($state, authService) {
    'ngInject';
    this.$state = $state;
    this.authService = authService;
  }

  logout() {
    this.authService.logout();
    this.$state.go('main');
  }

  get displayName() {
    return this.authService.displayName;
  }

  get isLoggedIn() {
    return this.authService.isLoggedIn();
  }
}
