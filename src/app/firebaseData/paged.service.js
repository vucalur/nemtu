class Paged_ScopePrototype {
  constructor($q, ref) {
    this.$q = $q;
    // TODO(vucalur): move to app config, DRY
    const PAGE_SIZE = 50;
    this._PAGE_SIZE_PLUS_CURSOR = PAGE_SIZE + 1;
    this._ref = ref;
    this._refOrdr = ref.orderByKey();
    this._allProcessed = false;
    this._setSentinel();
  }

  /**
   * Save sentinel on init, so that freshly added items won't affect pagination, won't be included in results
   */
  _setSentinel() {
    this._emptyOnInit = true;
    // FIXME(vucalur): wait for the promise to resolve - cursor may be null if getNextPage() invoked right after init
    // FIXME(vucalur): …and Firebase does not process queries in the order of submission
    const ref = this._refOrdr.limitToLast(1);
    ref.once('child_added').then(snap => {
      this._emptyOnInit = false;
      this._cursor = snap.key;
    });
  }

  /**
   * new items added with this method won't affect pagination, won't be included in results - see _setSentinel()
   */
  addOmittingPagination(...items) {
    const waitFor = [];

    const result = items.map(item => {
      Paged_ScopePrototype._stripKey(item);
      const newRefAndPromise = this._ref.push(item);
      waitFor.push(newRefAndPromise); // as a promise
      return Paged_ScopePrototype._itemWithKey1(item, newRefAndPromise.key);  // as a ref
    });

    return this.$q.all(waitFor)
      .then(() => result);
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
    if (this._allProcessed || this._emptyOnInit) {
      return this._resolveWithEmptyPage();
    }
    let ref = this._refOrdr;
    if (this._cursor) {
      ref = ref.endAt(this._cursor);
    }
    ref = ref.limitToLast(this._PAGE_SIZE_PLUS_CURSOR);

    return ref.once('value')
      .then(snap => {
        const page = [];
        snap.forEach(child => {
          page.push(Paged_ScopePrototype._itemWithKey2(child));
        });
        page.reverse();  // apply from latest to oldest order
        this._handleCursor(page);
        return page;
      });
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

  _resolveWithEmptyPage() {
    return this.$q.when([]);
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
