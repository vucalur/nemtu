import angular from 'angular';
import CreateController from "./create.controller";

export default class ChannelsController {
  constructor($document, $mdSidenav, $mdDialog, channelsService, user) {
    'ngInject';

    this.$document = $document;
    this.$mdSidenav = $mdSidenav;
    this.$mdDialog = $mdDialog;
    this.selected = null;
    this.channels = channelsService.getChannelsByUser(user.uid);
    this.uid = user.uid;
  }

  toggleList() {
    this.$mdSidenav('left').toggle();
  }

  selectItem(item) {
    this.selected = item;
  }

  add(ev) {
    this._showDialog(ev)
      .then(newChannel => {
        this.channels.$add(newChannel);
      });
  }

  edit(ev, channelToEdit) {
    this._showDialog(ev, channelToEdit)
      .then(edited => {
        this.channels.$save(edited);
      });
  }

  _showDialog(ev, channelToEdit) {
    const dialogProps = {
      controller: CreateController,
      controllerAs: 'vm',
      locals: {
        channelToEdit,
        uid: this.uid // TODO(vucalur): eliminate crazy uid passing. DI anyone ?
      },
      templateUrl: 'app/components/channels/create.html',
      parent: angular.element(this.$document.body),
      targetEvent: ev,
      escapeToClose: true
    };

    const channelPromise = this.$mdDialog.show(dialogProps);
    return channelPromise;
  }

  remove(ev, channelToRemove) {
    const confirm = this.$mdDialog.confirm()
      .title(`Would you like to remove "${channelToRemove.name}" channel?`)
      .textContent('Removing the channel will also remove its all posts')
      .ariaLabel('Channel removal')
      .targetEvent(ev)
      .ok('Yes, Remove')
      .cancel('Cancel');

    this.$mdDialog.show(confirm).then(() => {
      this.channels.$remove(channelToRemove);
    });
  }
}
