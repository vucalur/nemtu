import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';

import {routerConfig} from './_.route';
import articles from '../articles/component';
import channels from './component';
import ArticlesService from '../articles/service.js';
import ParserService from '../articles/parser.service.js';
import ChannelsService from './service';

import './style.scss';

export default angular.module('nemtu.channels', [
  ngMaterial,
  uiRouter
])
  .config(routerConfig)
  .component('articles', articles)
  .service('articlesService', ArticlesService)
  .service('channelsService', ChannelsService)
  .service('parserService', ParserService)
  .component('channels', channels)
;
