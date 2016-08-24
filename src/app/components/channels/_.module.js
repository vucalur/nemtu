import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';

import {routerConfig} from './_.route';
import ArticlesController from './articles.controller';
import ChannelsController from './list.controller';
import ArticlesService from './articles.service.js';
import ParserService from './parser.service.js';
import ChannelsService from './channels.service';

import './style.scss';

export default angular.module('nemtu.channels', [
  ngMaterial,
  uiRouter
])
  .config(routerConfig)
  .controller('ArticlesController', ArticlesController)
  .service('articlesService', ArticlesService)
  .service('channelsService', ChannelsService)
  .service('parserService', ParserService)
  .controller('ChannelsController', ChannelsController)
;
