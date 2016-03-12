export class ParserService {
  parse(rawAllegroHtmlPage) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(rawAllegroHtmlPage, 'text/html');
    var articlesQuery = '//*[@id="featured-offers"]/article';
    var articles = doc.evaluate(articlesQuery, doc, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

    var parsedArticles = [];
    var article = articles.iterateNext();
    while (article) {
      var title = doc.evaluate('div[2]/h2/a', article, null, XPathResult.STRING_TYPE, null);
      var img = doc.evaluate('div[1]/a/@data-src', article, null, XPathResult.STRING_TYPE, null);
      var price = doc.evaluate('div[2]/div[2]/span[1]/span/text()', article, null, XPathResult.STRING_TYPE, null);
      parsedArticles.push({
        title: title.stringValue,
        img: img.stringValue,
        price: price.stringValue
      });
      article = articles.iterateNext();
    }

    return parsedArticles;
  }
}
