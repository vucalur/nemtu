export class CreateController {
  constructor($mdDialog, engineToUpdate) {
    'ngInject';

    this.$mdDialog = $mdDialog;
    this.engine = engineToUpdate ? engineToUpdate : this._defaultEngine();
  }

  _defaultEngine() {
    var engine = {
      pagination: {
        active: false
      }
    };
    return engine;
  }

  cancel() {
    this.$mdDialog.cancel();
  }

  create() {
    var engine = this._removeUnusedFields(this.engine);
    this.$mdDialog.hide(engine);
  }

  _removeUnusedFields(engine) {
    // pagination
    if (engine.pagination.active) {
      switch (engine.pagination.type) {
        case 'query':
          delete engine.pagination.linkToNext;
          break;
        case 'linkToNext':
          delete engine.pagination.query;
          break;
      }
    } else {
      delete engine.pagination.type;
      delete engine.pagination.linkToNext;
      delete engine.pagination.query;
    }

    return engine;
  }
}
