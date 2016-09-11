import angular from 'angular';
import ngSanitize from 'angular-sanitize';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';

import {routerConfig} from './_.route';
import channels from './component';
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
  .config(routerConfig)
  .config(themes)
  .service('Crawler', Crawler)
  .service('Parser', Parser)
  .component('channels', channels)
  .component('channel', channel)
;

function themes($mdThemingProvider) {
  $mdThemingProvider.theme('unread')
    .backgroundPalette('light-blue');
}
