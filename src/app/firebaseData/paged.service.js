class Paged_ScopePrototype {
  constructor($q, ref) {
    this.$q = $q;
    // TODO(vucalur): move to app config, DRY
    const PAGE_SIZE = 50;
    this._PAGE_SIZE_PLUS_CURSOR = PAGE_SIZE + 1;
    this._ref = ref;
    this._refOrdr = ref.orderByKey();
    this._allProcessed = false;
    this._initComplete = this._init();
  }

  _init() {
    // http://stackoverflow.com/questions/39560811/how-to-check-efficiently-if-collection-is-empty

    const initComplete = this._refOrdr.limitToLast(1).once('value')
      .then(collectionSnap => {
        this._setEmptyOnInit(collectionSnap);
        if (!this._emptyOnInit) {
          this._setSentinel(collectionSnap);
        }
      });
    return initComplete;
  }

  _setEmptyOnInit(collectionSnap) {
    this._emptyOnInit = collectionSnap.numChildren() === 0;
  }

  /**
   * Save sentinel on init, so that freshly added items won't affect pagination and won't be included in results
   * @param collectionSnap Has to be limited to the last child only by `orderToLast(1)`
   */
  _setSentinel(collectionSnap) {
    collectionSnap.forEach(item => {
      this._cursor = item.key;
    });
  }

  /**
   * New items added with this method won't affect pagination, won't be included in results - see _setSentinel()
   */
  addOmittingPagination(...items) {
    return this._initComplete.then(() => {
      const waitFor = [];

      const result = items.map(item => {
        Paged_ScopePrototype._stripKey(item);
        const newRefAndPromise = this._ref.push(item);
        waitFor.push(newRefAndPromise); // as a promise
        return Paged_ScopePrototype._itemWithKey1(item, newRefAndPromise.key);  // as a ref
      });

      return this.$q.all(waitFor)
        .then(() => result);
    });
  }

  // method overload
  static _itemWithKey1(item, key) {
    item.$key = key;  // analogous to angularfire's $id
    return item;
  }

  // method overload
  static _itemWithKey2(snap) {
    return Paged_ScopePrototype._itemWithKey1(snap.val(), snap.key);
  }

  static _stripKey(item) {
    delete item.$key;
    return item;
  }

  getNextPage() {
    return this._initComplete.then(() => {
      if (this._allProcessed || this._emptyOnInit) {
        return this._emptyPage();
      }
      let ref = this._refOrdr;
      ref = ref.endAt(this._cursor);  // undefined _cursor already handled by _emptyOnInit check above
      ref = ref.limitToLast(this._PAGE_SIZE_PLUS_CURSOR);

      return ref.once('value')
        .then(collectionSnap => {
          const page = [];
          collectionSnap.forEach(item => {
            page.push(Paged_ScopePrototype._itemWithKey2(item));
          });
          page.reverse();  // apply from latest to oldest order
          this._handleCursor(page);
          return page;
        });
    });
    // using ng's built-in promise unwrapping here:
    //    …
    //    return sth.then(() => page);
    // }).then(page => {
    //    …
    // }
  }

  _emptyPage() {
    return [];
  }

  _handleCursor(page) {
    if (page.length === 0) {
      return;
    }
    const newCursorItem = page[page.length - 1];
    this._cursor = newCursorItem.$key;
    if (this._thereWillBeAnotherPage(page)) {
      // cursor's val will be added to the next page's results
      Paged_ScopePrototype._removeCursor(page);
    } else {
      this._allProcessed = true;
    }
  }

  _thereWillBeAnotherPage(page) {
    return this._currentPageFull(page);
  }

  _currentPageFull(page) {
    return page.length === this._PAGE_SIZE_PLUS_CURSOR;
  }

  static _removeCursor(page) {
    page.pop();
  }
}

/**
 * Totally doesn't fit service semantics. Making it one only because I need those deps injected by angular.
 */
export default class Paged {
  constructor($q) {
    'ngInject';
    this.createInstance = ref =>
      new Paged_ScopePrototype($q, ref);
  }
}
