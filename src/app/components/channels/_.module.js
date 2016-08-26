import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';

import {routerConfig} from './_.route';
import articles from '../articles/component';
import channels from './component';
import Articles from '../articles/service.js';
import Parser from '../articles/parser.service.js';
import Channels from './service';

import './style.scss';

export default angular.module('nemtu.channels', [
  ngMaterial,
  uiRouter
])
  .config(routerConfig)
  .component('articles', articles)
  .service('Articles', Articles)
  .service('Channels', Channels)
  .service('Parser', Parser)
  .component('channels', channels)
;
