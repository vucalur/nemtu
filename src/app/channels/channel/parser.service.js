import angular from "angular";

class ParsedDocument {
  constructor($log, doc, engine) {
    this.$log = $log;
    this._doc = doc;
    this._engine = engine;
  }

  scrapArticles() {
    const articleSelector = this._engine.articleSel;
    const articlesDoc = this._doc.evaluate(articleSelector, this._doc, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

    const scrapedArticles = [];

    for (let articleDoc = articlesDoc.iterateNext(); articleDoc; articleDoc = articlesDoc.iterateNext()) {
      const scrapedArticle = this._scrapFixedFields(articleDoc);
      const customFieldsObj = this._scrapCustomFields(articleDoc);
      angular.extend(scrapedArticle, customFieldsObj);
      scrapedArticles.push(scrapedArticle);
    }

    this.$log.info(`${scrapedArticles.length} articles scraped.`);
    return scrapedArticles;
  }

  _scrapFixedFields(articleDoc) {
    const listingId = this._evaluate(this._engine.article.listingIdSel, articleDoc);
    const title = this._evaluate(this._engine.article.titleSel, articleDoc);
    const url = this._evaluate(this._engine.article.urlSel, articleDoc);
    const imgUrl = this._evaluate(this._engine.article.imgUrlSel, articleDoc);
    return {
      listingId: listingId.stringValue,
      title: title.stringValue,
      url: url.stringValue,
      imgUrl: imgUrl.stringValue
    };
  }

  _evaluate(selector, articleDoc) {
    // TODO(vucalur): validate engine model instead of "|| null"
    return this._doc.evaluate(selector || null, articleDoc, null, XPathResult.STRING_TYPE, null);
  }

  _scrapCustomFields(articleDoc) {
    const scrapedValues = {};
    this._engine.article.customFields.forEach(field => {
      const scrapedValue = this._evaluate(field.selector, articleDoc);
      // TODO(vucalur): label may not be a good choice for a key.
      scrapedValues[field.label] = scrapedValue.stringValue;
    });

    return {
      customFieldsValues: scrapedValues
    };
  }

  scrapLinkToNextPage() {
    const linkToNextSel = this._engine.pagination.linkToNext.sel;
    const link = this._evaluate(linkToNextSel, this._doc);
    return link.stringValue;
  }
}

export default class Parser {
  constructor($log) {
    'ngInject';

    this.prepareDocument = (rawHtml, engine) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(rawHtml, 'text/html');
      return new ParsedDocument($log, doc, engine);
    };
  }
}
