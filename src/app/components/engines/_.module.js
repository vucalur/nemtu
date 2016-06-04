import {routerConfig} from './_.route.js';
import {ListController} from './list.controller.js';
import {EnginesService} from './engines.serivce.js';

angular.module('nemtu.engines', [
  'ui.router',
  'ngMaterial',
  'ngMdIcons'
])
  .config(routerConfig)
  .controller('ListController', ListController)
  .service('enginesService', EnginesService)
;
