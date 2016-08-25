import angular from "angular";

export default class CreateController {
  constructor($mdDialog, engineToEdit) {
    'ngInject';

    this.$mdDialog = $mdDialog;
    this.engine = this._createWorkingDraft(engineToEdit);
    this._originalEngine = engineToEdit;
  }

  _createWorkingDraft(engineToEdit) {
    return (engineToEdit ? angular.copy(engineToEdit) : this._defaultEngine());
  }

  _defaultEngine() {
    const engine = {
      pagination: {
        active: false
      }
    };
    return engine;
  }

  cancel() {
    this.$mdDialog.cancel();
  }

  save() {
    if (this._originalEngine) {
      // unable to hide() with this.engine, since angular.copy() has omitted important fields
      this._applyEditsOnOriginal();
      this._sanitizeForm(this._originalEngine); // must happen after applying edits - pagination might have been edited
      this.$mdDialog.hide(this._originalEngine);
    } else {
      this._sanitizeForm(this.engine);
      this.$mdDialog.hide(this.engine);
    }
  }

  _applyEditsOnOriginal() {
    angular.extend(this._originalEngine, this.engine);
  }

  _sanitizeForm(engine) {
    const pagination = engine.pagination;
    if (pagination.active) {
      switch (pagination.type) {
        case 'query':
          delete pagination.linkToNext;
          break;
        case 'linkToNext':
          delete pagination.query;
          break;
        // no default
      }
    } else {
      delete pagination.type;
      delete pagination.linkToNext;
      delete pagination.query;
    }
  }
}
