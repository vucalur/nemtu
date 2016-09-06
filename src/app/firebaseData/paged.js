export default class Paged {
  constructor(ref) {
    // TODO(vucalur): move to app config, DRY
    const PAGE_SIZE = 50;
    this._PAGE_SIZE_PLUS_CURSOR = PAGE_SIZE + 1;
    this._ref = ref;
    this._refOrdr = ref.orderByKey();
    this._setSentinel();
  }

  /**
   * Save sentinel on init, so that freshly added items won't affect pagination, won't be included in results
   */
  _setSentinel() {
    // FIXME(vucalur): wait for the promise to resolve - cursor is null when getNextPage() first invoked
    const ref = this._refOrdr.limitToLast(1);
    ref.once('child_added').then(snap => {
      this._cursor = snap.key;
    });
  }

  /**
   * new items added with this method won't affect pagination, won't be included in results - see _setSentinel()
   */
  addOmitPagination(...items) {
    items.map(item => this._stripKey(item))
      .forEach(item => this._ref.push(item));
  }

  _stripKey(item) {
    delete item.$key;
    return item;
  }

  getNextPage() {
    let ref = this._refOrdr;
    if (this._cursor) {
      ref = ref.endAt(this._cursor);
    }
    ref = ref.limitToLast(this._PAGE_SIZE_PLUS_CURSOR);

    return ref.once('value')
      .then(snap => {
        const page = [];
        snap.forEach(child => {
          page.push(this._itemWithKey(child));
        });
        page.reverse();  // apply from latest to oldest order
        this._handleCursor(page);
        return page;
      });
  }

  _itemWithKey(snap) {
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
      this._removeCursor(page);
    }
  }

  _thereWillBeAnotherPage(page) {
    return this._currentPageFull(page);
  }

  _currentPageFull(page) {
    return page.length === this._PAGE_SIZE_PLUS_CURSOR;
  }

  _removeCursor(page) {
    page.pop();
  }
}
