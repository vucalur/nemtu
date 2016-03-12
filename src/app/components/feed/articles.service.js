export class ArticlesService {
  constructor($log, $http, parser) {
    'ngInject';

    this.$log = $log;
    this.$http = $http;
    this.parser = parser;
  }

  _fetch(allegroUrl) {
    var req = {
      method: 'GET',
      url: 'nemtuRelay',
      headers: {
        'nemtuUrl': allegroUrl
      }
    };

    return this.$http(req)
      .then(response => {
        this.$log.info(`NemtuRelay successful for ${allegroUrl}.`);
        return response.data;
      })
      .catch(error => {
        this.$log.error(`NemtuRelay failed for ${allegroUrl}.\n` + angular.toJson(error.data, true));
      });
  }

  parsed(allegroUrl) {
    return this._fetch(allegroUrl)
      .then(this.parser.parse);
  }
}
