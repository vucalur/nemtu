import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';
import firebase from 'angularfire';

import {routerConfig} from './_.route.js';
import ListController from './list.controller.js';
import EnginesService from './engines.serivce.js';

import './style.scss';

export default angular.module('nemtu.engines', [
  ngMaterial,
  uiRouter,
  firebase
  // TODO(vucalur): find alternative to angular-material-icons
  // 'ngMdIcons'
])
  .config(routerConfig)
  .controller('ListController', ListController)
  .service('enginesService', EnginesService)
;
