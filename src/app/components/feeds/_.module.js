import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';

import {routerConfig} from './_.route';
import ArticlesController from './articles.controller';
import ChannelsController from './channels.controller';
import ArticlesService from './articles.service.js';
import ParserService from './parser.service.js';

import './style.scss';

export default angular.module('nemtu.feeds', [
  ngMaterial,
  uiRouter
])
  .config(routerConfig)
  .controller('ArticlesController', ArticlesController)
  .service('articlesService', ArticlesService)
  .service('parserService', ParserService)
  .controller('ChannelsController', ChannelsController)
;
