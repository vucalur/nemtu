import { routerConfig } from './feed.route';
import {ArticlesController} from './articles/articles.controller.js';
import {ArticlesService} from './articles/articles.service.js';
import {ParserService} from './articles/parser.service.js';
import {ListController} from './engine/list.controller.js';
import {EnginesService} from './engine/engine.serivce.js';

angular.module('nemtu.feed', [
    'ui.router',
    'ngMaterial',
    'ngMdIcons',
    'ngResource'
  ])
  .config(routerConfig)
  .controller('ArticlesController', ArticlesController)
  .service('articlesService', ArticlesService)
  .service('parserService', ParserService)
  .controller('ListController', ListController)
  .service('enginesService', EnginesService)
;
