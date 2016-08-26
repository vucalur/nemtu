import angular from 'angular';

export default class Articles {
  constructor($log, $http, Parser) {
    'ngInject';

    this.$log = $log;
    this.$http = $http;
    this.Parser = Parser;
  }

  _fetch(allegroUrl) {
    const req = {
      method: 'GET',
      url: 'nemtuRelay',
      headers: {
        nemtuUrl: allegroUrl
      }
    };

    return this.$http(req)
      .then(response => {
        this.$log.info(`NemtuRelay successful for ${allegroUrl}.`);
        return response.data;
      })
      .catch(error => {
        this.$log.error(`NemtuRelay failed for ${allegroUrl}.\n${angular.toJson(error.data, true)}`);
      });
  }

  parsed(allegroUrl) {
    return this._fetch(allegroUrl)
      .then(this.Parser.parse);
  }
}
