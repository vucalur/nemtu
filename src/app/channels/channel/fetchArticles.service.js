import angular from 'angular';

export default class FetchArticles {
  constructor($log, $http, Parser) {
    'ngInject';

    this.$log = $log;
    this.$http = $http;
    this.Parser = Parser;
  }

  _fetch(url) {
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

  parsed(url, engineToUse) {
    return this._fetch(url)
      .then(rawHtml => this.Parser.parse(rawHtml, engineToUse));
  }
}
