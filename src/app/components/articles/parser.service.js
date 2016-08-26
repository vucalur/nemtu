export default class Parser {
  parse(rawAllegroHtmlPage) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawAllegroHtmlPage, 'text/html');
    const articlesQuery = '//*[@id="featured-offers"]/article';
    const articles = doc.evaluate(articlesQuery, doc, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

    const parsedArticles = [];
    let article = articles.iterateNext();
    while (article) {
      const title = doc.evaluate('div[2]/h2/a', article, null, XPathResult.STRING_TYPE, null);
      const img = doc.evaluate('div[1]/a/@data-src', article, null, XPathResult.STRING_TYPE, null);
      const price = doc.evaluate('div[2]/div[2]/span[1]/span/text()', article, null, XPathResult.STRING_TYPE, null);
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
