import {CreateController} from './create.controller.js';

export class ListController {
  constructor($document, $mdDialog, enginesService, user) {
    'ngInject';

    this.$document = $document;
    this.$mdDialog = $mdDialog;
    this.engineService = enginesService;
    this.engines = this.engineService.getEnginesByUser(user.uid);
  }

  addOrEdit(ev, selectedEngine) {
    var dialogProps = {
      controller: CreateController,
      controllerAs: 'vm',
      locals: {engineToUpdate: selectedEngine},
      templateUrl: 'app/components/engines/create.html',
      parent: angular.element(this.$document.body),
      targetEvent: ev,
      clickOutsideToClose: false,
      escapeToClose: false,
      fullscreen: true
    };
    this.$mdDialog.show(dialogProps)
      .then(engine => {
        if (selectedEngine) {
          this.engines.$save(engine);
        } else {
          this.engines.$add(engine);
        }
      });
  }

  remove(ev, selectedEngine) {
    var confirm = this.$mdDialog.confirm()
      .title(`Would you like to remove "${selectedEngine.name}" engine?`)
      .textContent('After removal no new data will be collected by feeds that have been using this engine')
      .ariaLabel('Engine removal')
      .targetEvent(ev)
      .ok('Yes, Remove')
      .cancel('Cancel');

    this.$mdDialog.show(confirm).then(() => {
      this.engines.$remove(selectedEngine);
    });
  }
}


