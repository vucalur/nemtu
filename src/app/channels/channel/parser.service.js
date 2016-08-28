export default class Parser {
  constructor($log) {
    'ngInject';

    this.$log = $log;
  }

  parse(rawHtml, engine) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawHtml, 'text/html');
    const articlesQuery = engine.articleSel;
    const articles = doc.evaluate(articlesQuery, doc, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

    const parsedArticles = [];

    for (let article = articles.iterateNext(); article; article = articles.iterateNext()) {
      const id = doc.evaluate(engine.article.idSel, article, null, XPathResult.STRING_TYPE, null);
      const title = doc.evaluate(engine.article.titleSel, article, null, XPathResult.STRING_TYPE, null);
      const url = doc.evaluate(engine.article.urlSel, article, null, XPathResult.STRING_TYPE, null);
      const imgUrl = doc.evaluate(engine.article.imgUrlSel, article, null, XPathResult.STRING_TYPE, null);
      const price = doc.evaluate(engine.article.priceSel, article, null, XPathResult.STRING_TYPE, null);
      parsedArticles.push({
        id: id.stringValue,
        title: title.stringValue,
        url: url.stringValue,
        imgUrl: imgUrl.stringValue,
        price: price.stringValue
      });
    }

    this.$log.info(`${parsedArticles.length} articles parsed.`);
    return parsedArticles;
  }
}
