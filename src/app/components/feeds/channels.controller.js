export default class ChannelsController {
  constructor($mdSidenav) {
    'ngInject';

    this.$mdSidenav = $mdSidenav;
    this.selected = null;
  }

  toggleList() {
    this.$mdSidenav('left').toggle();
  }

  selectItem(item) {
    this.selected = item;
  }
}