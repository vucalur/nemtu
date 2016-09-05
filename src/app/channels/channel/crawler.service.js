import angular from 'angular';

export default class Crawler {
  constructor($log, $http, Parser) {
    'ngInject';

    this.$log = $log;
    this.$http = $http;
    this.Parser = Parser;
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

  fetchArticles(url, engine) {
    if (engine.pagination.active) {
      return this._handlePagination(url, engine);
    } else {
      return this._handleSinglePage(url, engine);
    }
  }

  _handleSinglePage(url, engine) {
    return this._fetchHtml(url)
      .then(rawHtml => this.Parser.parseArticles(rawHtml, engine));
  }

  _handlePagination(url, engine) {
    switch (engine.pagination.type) {
      case 'query':
        return this._handlePaginationQuery(url, engine);
      case 'linkToNext':
        return this._handlePaginationLink(url, engine);
      // no default
    }
  }

  // TODO(vucalur): refactor constant passing engine and url
  _handlePaginationQuery(url, engine) {
    const articles = [];
    const startPage = engine.pagination.query.start;
    return this._crawlByQuery(url, engine, articles, startPage);
  }

  _crawlByQuery(url, engine, articles, page) {
    url = this._setPage(url, page, engine);

    return this._fetchHtml(url)
      .then(rawHtml => {
        const newArticles = this.Parser.parseArticles(rawHtml, engine);
        if (this._pageEmpty(newArticles)) {
          this.$log.info(`Total of ${articles.length} articles crawled.`);
          return articles;
        } else {
          articles.push(...newArticles);
          page += engine.pagination.query.inc;
          return this._crawlByQuery(url, engine, articles, page);
        }
      });
  }

  _setPage(urlString, page, engine) {
    const paramName = engine.pagination.query.param;
    const url = new URL(urlString);
    url.searchParams.set(paramName, page);
    const urlStringPageSet = url.href;
    return urlStringPageSet;
  }

  _pageEmpty(articles) {
    return articles.length === 0;
  }

  _handlePaginationLink() {
    // TODO(vucalur):
    return null;
  }
}
