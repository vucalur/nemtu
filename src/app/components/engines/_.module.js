import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';
import firebase from 'angularfire';

import {routerConfig} from './_.route';
import engines from './component';
import EnginesService from './serivce';

import './style.scss';

export default angular.module('nemtu.engines', [
  ngMaterial,
  uiRouter,
  firebase
  // TODO(vucalur): find alternative to angular-material-icons
  // 'ngMdIcons'
])
  .config(routerConfig)
  .component('engines', engines)
  .service('enginesService', EnginesService)
;
