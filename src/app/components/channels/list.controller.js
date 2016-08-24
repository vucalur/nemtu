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
    this._addOrEdit(ev);
  }

  edit(ev, selectedChannel) {
    this._addOrEdit(ev, selectedChannel);
  }

  _addOrEdit(ev, selectedChannel) {
    const dialogProps = {
      controller: CreateController,
      controllerAs: 'vm',
      locals: {
        channelToUpdate: selectedChannel,
        uid: this.uid
      },
      templateUrl: 'app/components/channels/create.html',
      parent: angular.element(this.$document.body),
      targetEvent: ev,
      escapeToClose: true
    };
    this.$mdDialog.show(dialogProps)
      .then(channel => {
        if (selectedChannel) {
          this.channels.$save(channel);
        } else {
          this.channels.$add(channel);
        }
      });
  }

  remove(ev, selectedChannel) {
    const confirm = this.$mdDialog.confirm()
      .title(`Would you like to remove "${selectedChannel.name}" channel?`)
      .textContent('Removing the channel will also remove its all posts')
      .ariaLabel('Channel removal')
      .targetEvent(ev)
      .ok('Yes, Remove')
      .cancel('Cancel');

    this.$mdDialog.show(confirm).then(() => {
      this.channels.$remove(selectedChannel);
    });
  }
}
