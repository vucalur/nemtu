import angular from "angular";

export default class CreateController {
  constructor($mdDialog, engineToEdit) {
    'ngInject';

    this.$mdDialog = $mdDialog;
    this.engine = this._createWorkingDraft(engineToEdit);
    this._originalEngine = engineToEdit;
    this.customFieldTypes = ['text', 'html'];
    this.customFieldActions = [
      {name: 'Delete', icon: 'clear', id: 'delete'},
      {name: 'Move up', icon: 'arrow_upwards', id: 'move_up'},
      {name: 'Move down', icon: 'arrow_downward', id: 'move_down'}
    ];

    // TODO(vucalur): empty article selectors should not be allowed by form validation
    this.engine.article = this.engine.article || {};
    // This, however, is ok. No custom fields sets `this.engine.article.fields` to undefined when using Firebase as the storage
    this.engine.article.customFields = this.engine.article.customFields || [];

    this._customFields = this.engine.article.customFields;  // handy in many methods
  }

  _createWorkingDraft(engineToEdit) {
    return (engineToEdit ? angular.copy(engineToEdit) : this._defaultEngine());
  }

  _defaultEngine() {
    const engine = {
      article: {
        customFields: [
          {label: 'price', type: 'text', selector: '<<price_sel>>'},
          {label: 'description', type: 'html', selector: '<<desc_sel>>'}
        ]
      },
      pagination: {
        active: false
      }
    };
    return engine;
  }

  performCustomFieldAction(actionId, fieldIndex) {
    switch (actionId) {
      case 'delete':
        this._customFields.splice(fieldIndex, 1);
        break;
      case 'move_up':
        if (this._canBeMovedUp(fieldIndex)) {
          this._swapFields(fieldIndex, fieldIndex - 1);
        }
        break;
      case 'move_down':
        if (this._canBeMovedDown(fieldIndex)) {
          this._swapFields(fieldIndex, fieldIndex + 1);
        }
        break;
      // no default
    }
  }

  addCustomField() {
    this._customFields.push({});
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

  _canBeMovedUp(fieldIndex) {
    return fieldIndex > 0;
  }

  _canBeMovedDown(fieldIndex) {
    return fieldIndex < this._customFields.length - 1;
  }

  _swapFields(index1, index2) {
    const tmp = this._customFields[index1];
    this._customFields[index1] = this._customFields[index2];
    this._customFields[index2] = tmp;
  }
}
