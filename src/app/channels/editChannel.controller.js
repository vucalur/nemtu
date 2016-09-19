import angular from "angular";

export default class EditChannelController {
  constructor($mdDialog, Engines, channelToEdit) {
    'ngInject';

    this.$mdDialog = $mdDialog;
    this.engines = Engines.getEngines();
    this.channel = this._createWorkingDraft(channelToEdit);
    this._originalChannel = channelToEdit;
  }

  _createWorkingDraft(channelToEdit) {
    return (channelToEdit ? angular.copy(channelToEdit) : {});
  }

  cancel() {
    this.$mdDialog.cancel();
  }

  save() {
    if (this._originalChannel) {
      // unable to hide() with this.channel, since angular.copy() has omitted important angular's properties (e.g. $$hash)
      this._applyEditsOnOriginal();
      this.$mdDialog.hide(this._originalChannel);
    } else {
      this.$mdDialog.hide(this.channel);
    }
  }

  _applyEditsOnOriginal() {
    angular.extend(this._originalChannel, this.channel);
  }
}
