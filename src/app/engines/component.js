import angular from 'angular';
import CreateController from './create.controller';

class ListController {
  constructor($document, $mdDialog, Engines) {
    'ngInject';

    this.$document = $document;
    this.$mdDialog = $mdDialog;
    this.engines = Engines.getEngines(this.user.uid);
  }

  add(ev) {
    this._engineDialog(ev)
      .then(newEngine => {
        this.engines.$add(newEngine);
      });
  }

  edit(ev, engineToEdit) {
    this._engineDialog(ev, engineToEdit)
      .then(edited => {
        this.engines.$save(edited);
      });
  }

  _engineDialog(ev, engineToEdit) {
    const dialogProps = {
      controller: CreateController,
      controllerAs: 'vm',
      locals: {engineToEdit},
      templateUrl: 'app/engines/create.html',
      parent: angular.element(this.$document.body),
      targetEvent: ev,
      clickOutsideToClose: false,
      escapeToClose: false,
      fullscreen: true
    };
    const enginePromise = this.$mdDialog.show(dialogProps);
    return enginePromise;
  }

  remove(ev, engineToRemove) {
    const confirm = this.$mdDialog.confirm()
      .title(`Would you like to remove "${engineToRemove.name}" engine?`)
      .textContent('After removal no new data will be collected by channels that have been using this engine')
      .ariaLabel('Engine removal')
      .targetEvent(ev)
      .ok('Yes, Remove')
      .cancel('Cancel');

    this.$mdDialog.show(confirm).then(() => {
      this.engines.$remove(engineToRemove);
    });
  }
}

export default {
  templateUrl: 'app/engines/list.html',
  controller: ListController,
  controllerAs: 'vm',
  bindings: {
    user: '<'
  }
};