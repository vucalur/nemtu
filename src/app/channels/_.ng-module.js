import angular from 'angular';
import ngSanitize from 'angular-sanitize';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';

import states from './_.states';
import channels from './channels.component';
import Crawler from './channel/crawler.service';
import Parser from './channel/parser.service';
import channel from './channel/channel.component';

import './style.scss';
import './channel/style.scss';

export default angular.module('nemtu.channels', [
  ngSanitize,
  ngMaterial,
  uiRouter
])
  .config(states)
  .config(themes)
  .service('Crawler', Crawler)
  .service('Parser', Parser)
  .component('channels', channels)
  .component('channel', channel)
;

function themes($mdThemingProvider) {
  'ngInject';
  $mdThemingProvider.theme('unread')
    .backgroundPalette('light-blue');
}
