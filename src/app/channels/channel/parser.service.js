class ParsedDocument {
  constructor($log, doc, engine) {
    this.$log = $log;
    this._doc = doc;
    this._engine = engine;
  }

  parseArticles() {
    const articleSelector = this._engine.articleSel;
    const articles = this._doc.evaluate(articleSelector, this._doc, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

    const parsedArticles = [];

    for (let article = articles.iterateNext(); article; article = articles.iterateNext()) {
      const listingId = this._doc.evaluate(this._engine.article.listingIdSel, article, null, XPathResult.STRING_TYPE, null);
      const title = this._doc.evaluate(this._engine.article.titleSel, article, null, XPathResult.STRING_TYPE, null);
      const url = this._doc.evaluate(this._engine.article.urlSel, article, null, XPathResult.STRING_TYPE, null);
      const imgUrl = this._doc.evaluate(this._engine.article.imgUrlSel, article, null, XPathResult.STRING_TYPE, null);
      const price = this._doc.evaluate(this._engine.article.priceSel, article, null, XPathResult.STRING_TYPE, null);
      parsedArticles.push({
        listingId: listingId.stringValue,
        title: title.stringValue,
        url: url.stringValue,
        imgUrl: imgUrl.stringValue,
        price: price.stringValue
      });
    }

    this.$log.info(`${parsedArticles.length} articles parsed.`);
    return parsedArticles;
  }

  parseLinkToNextPage() {
    const linkToNextSel = this._engine.pagination.linkToNext.sel;
    const link = this._doc.evaluate(linkToNextSel, this._doc, null, XPathResult.STRING_TYPE, null);
    return link.stringValue;
  }
}

export default class Parser {
  constructor($log) {
    'ngInject';

    this.$log = $log;
  }

  prepareDocument(rawHtml, engine) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawHtml, 'text/html');
    return new ParsedDocument(this.$log, doc, engine);
  }
}
