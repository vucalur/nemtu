import { routerConfig } from './feed.route';
import {ArticlesController} from './articles.controller.js';
import {ArticlesService} from './articles.service.js';
import {ParserService} from './parser.service.js';

angular.module('nemtu.feed', [
    'ui.router',
    'ngMaterial',
    'ngMdIcons',
    'ngResource'
  ])
  .config(routerConfig)
  .controller('ArticlesController', ArticlesController)
  .service('articles', ArticlesService)
  .service('parser', ParserService)
;
