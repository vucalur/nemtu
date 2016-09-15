import angular from 'angular';

class Crawler_ScopePrototype {
  constructor($log, $http, Parser, url, engine) {
    this.$log = $log;
    this.$http = $http;
    this.Parser = Parser;
    this._url = url;
    this._engine = engine;
  }

  _fetchHtml(url) {
    const req = {
      method: 'GET',
      url: 'nemtuRelay',
      headers: {
        nemtuUrl: url
      }
    };

    return this.$http(req)
      .then(response => {
        this.$log.info(`NemtuRelay successful for ${url}.`);
        return response.data;
      })
      .catch(error => {
        this.$log.error(`NemtuRelay failed for ${url}.\n${angular.toJson(error.data, true)}`);
      });
  }

  fetchArticles() {
    if (this._engine.pagination.active) {
      return this._handlePagination();
    } else {
      return this._handleSinglePage();
    }
  }

  _handleSinglePage() {
    return this._fetchHtml(this._url)
      .then(rawHtml => {
        const articles = this.Parser.prepareDocument(rawHtml, this._engine).scrapArticles();
        this._makeUrlsAbsolute(articles, this._url);
        return articles;
      });
  }

  _handlePagination() {
    // TODO(vucalur): Magic number. ES6 Enums? inshttp://exploringjs.com/es6/ch_symbols.html ?
    switch (this._engine.pagination.type) {
      case 'query':
        return this._handlePaginationQuery();
      case 'linkToNext':
        return this._handlePaginationLink();
      // no default
    }
  }

  _handlePaginationQuery() {
    const articlesAccum = [];
    const startPage = this._engine.pagination.query.start;
    return this._crawlByQuery(startPage, articlesAccum);
  }

  _crawlByQuery(page, articlesAccum) {
    const url = this._setPage(this._url, page);

    return this._fetchHtml(url)
      .then(rawHtml => {
        const newArticles = this.Parser.prepareDocument(rawHtml, this._engine).scrapArticles();
        if (this._pageEmpty(newArticles)) {
          this.$log.info(`Total of ${articlesAccum.length} articles scraped.`);
          return articlesAccum;
        } else {
          this._makeUrlsAbsolute(newArticles, url);
          articlesAccum.push(...newArticles);
          page += this._engine.pagination.query.inc;
          return this._crawlByQuery(page, articlesAccum);
        }
      });
  }

  _setPage(urlString, page) {
    const paramName = this._engine.pagination.query.param;
    const url = new URL(urlString);
    url.searchParams.set(paramName, page);
    return url.toString();
  }

  _pageEmpty(articles) {
    return articles.length === 0;
  }

  _handlePaginationLink() {
    const articlesAccum = [];
    return this._crawlByLink(this._url, articlesAccum);
  }

  _crawlByLink(url, articlesAccum) {
    return this._fetchHtml(url)
      .then(rawHtml => {
        const doc = this.Parser.prepareDocument(rawHtml, this._engine);
        const newArticles = doc.scrapArticles();
        this._makeUrlsAbsolute(newArticles, url);
        let nextUrl = doc.scrapLinkToNextPage();
        nextUrl = this._absoluteUrl(nextUrl, url);
        articlesAccum.push(...newArticles);
        if (this._pageEmpty(newArticles) || !this._isValid(nextUrl)) {
          this.$log.info(`Total of ${articlesAccum.length} articles scraped.`);
          return articlesAccum;
        } else {
          return this._crawlByLink(nextUrl, articlesAccum);
        }
      });
  }

  _isValid(urlString) {
    return urlString && this._isHttpOrHttps(urlString);
  }

  _isHttpOrHttps(urlString) {
    const url = new URL(urlString);
    const protocol = url.protocol;
    return protocol === 'http:' || protocol === 'https:';
  }

  _makeUrlsAbsolute(articles, baseUrl) {
    articles.forEach(article => {
      // TODO(vucalur): Magic number. ES6 Enums? inshttp://exploringjs.com/es6/ch_symbols.html ?
      // TODO(vucalur): Maybe add global ES module with Engine & Article models with these defined as constants ?
      for (const prop of ['url', 'imgUrl']) {
        article[prop] = this._absoluteUrl(article[prop], baseUrl);
      }
    });
  }

  _absoluteUrl(urlString, baseUrlString) {
    if (!urlString) {
      return urlString;
    }
    const url = new URL(urlString, baseUrlString);
    return url.toString();
  }
}

export default class Crawler {
  constructor($log, $http, Parser) {
    'ngInject';

    this.createInstance = (url, engine) =>
      new Crawler_ScopePrototype($log, $http, Parser, url, engine);
  }
}
