import {routerConfig} from './_.route.js';
import {ArticlesController} from './articles.controller.js';
import {ChannelsController} from './channels.controller.js';
import {ArticlesService} from './articles.service.js';
import {ParserService} from './parser.service.js';

angular.module('nemtu.feeds', [
  'ui.router',
  'ngMaterial',
  'ngMdIcons'
])
  .config(routerConfig)
  .controller('ArticlesController', ArticlesController)
  .service('articlesService', ArticlesService)
  .service('parserService', ParserService)
  .controller('ChannelsController', ChannelsController)
;
