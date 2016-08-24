export default class CreateController {
  constructor($mdDialog, enginesService, channelToUpdate, uid) {
    'ngInject';

    this.$mdDialog = $mdDialog;
    this.engines = enginesService.getEnginesByUser(uid);
    this.channel = channelToUpdate ? channelToUpdate : {};
  }

  cancel() {
    this.$mdDialog.cancel();
  }

  create() {
    this.$mdDialog.hide(this.channel);
  }
}
