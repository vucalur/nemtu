import angular from 'angular';
import EditChannelController from "./editChannel.controller";

class ChannelsController {
  constructor($document, $mdSidenav, $mdDialog, Channels) {
    'ngInject';

    this.$document = $document;
    this.$mdSidenav = $mdSidenav;
    this.$mdDialog = $mdDialog;
    this.channels = Channels.getChannels(this.user.uid);
  }

  toggleList() {
    this.$mdSidenav('left').toggle();
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
      controller: EditChannelController,
      controllerAs: 'vm',
      locals: {
        channelToEdit,
        uid: this.user.uid // TODO(vucalur): eliminate crazy uid passing. DI anyone ?
      },
      template: require('./editChannel.template.html'),
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
      .textContent('Removing the channel will also remove its all articles')
      // TODO(vucalur): remove those articles then :)
      .ariaLabel('Channel removal')
      .targetEvent(ev)
      .ok('Yes, Remove')
      .cancel('Cancel');

    this.$mdDialog.show(confirm).then(() => {
      this.channels.$remove(channelToRemove);
    });
  }
}

export default {
  template: require('./channels.component.html'),
  controller: ChannelsController,
  controllerAs: 'vm',
  bindings: {
    user: '<'
  }
};
