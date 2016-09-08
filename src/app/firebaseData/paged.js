class Paged_ScopePrototype {
  /**
   * @param ref Cannot not point to an empty collection. Otherwise API will work correctly,
   * unless collection is never appended any new items:
   * Empty collection's getNextPage() calls will include items added with addOmitPagination(),
   * since sentinel
   */
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
    // FIXME(vucalur): wait for the promise to resolve - cursor may be null if getNextPage() invoked right after init
    // FIXME(vucalur): …and Firebase does not process quieries in the order of submission
    const ref = this._refOrdr.limitToLast(1);
    ref.once('child_added').then(snap => {
      this._cursor = snap.key;
    });
  }

  /**
   * new items added with this method won't affect pagination, won't be included in results - see _setSentinel()
   */
  addOmitPagination(...items) {
    items.map(item => Paged_ScopePrototype._stripKey(item))
      .forEach(item => this._ref.push(item));
  }

  static _stripKey(item) {
    delete item.$key;
    return item;
  }

  getNextPage() {
    if (this._allProcessed) {
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
          page.push(Paged_ScopePrototype._itemWithKey(child));
        });
        page.reverse();  // apply from latest to oldest order
        this._handleCursor(page);
        return page;
      });
  }

  static _itemWithKey(snap) {
    const item = snap.val();
    item.$key = snap.key;  // analogous to angularfire's $id
    return item;
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

export default class Paged {
  constructor($q) {
    'ngInject';
    this.createInstance = ref =>
      new Paged_ScopePrototype($q, ref);
  }
}
