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
    //FIXME(vucalur): wait for the promise to resolve - cursor is null when getNextPage() first invoked
    const ref = this._refOrdr.limitToLast(1);
    ref.once('child_added').then(snap => {
      this._cursor = snap.key;
    });
  }

  /**
   * new items added with this method won't affect pagination, won't be included in results - see _setSentinel()
   */
  addOmitPagination(items) {
    items.forEach(item => this._ref.push(item));
  }

  getNextPage() {
    let ref = this._refOrdr;
    if (this._cursor) {
      ref = ref.endAt(this._cursor);
    }
    ref = ref.limitToLast(this._PAGE_SIZE_PLUS_CURSOR);

    return ref.once('value')
      .then(snap => {
        const items = [];
        snap.forEach(item => {
          items.push({key: item.key, val: item.val()});
        });
        items.reverse();  // apply from latest to oldest order
        this._handleCursor(items);
        return this._extractVals(items);
      });
  }

  _handleCursor(items) {
    if (items.length === 0) {
      return;
    }
    const newCursorItem = items[items.length - 1];
    this._cursor = newCursorItem.key;
    if (this._pageFull(items)) {
      this._removeCursor(items); // cursor's val will be added to the next page's results
    }
  }

  _pageFull(items) {
    return items.length === this._PAGE_SIZE_PLUS_CURSOR;
  }

  _removeCursor(items) {
    items.pop();
  }

  _extractVals(items) {
    return items.map(i => i.val);
  }
}
