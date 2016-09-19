import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';
import firebase from 'angularfire';
import ngMdIcons from 'angular-material-icons';

import states from './_.states';
import engines from './engines.component';

import './style.scss';

export default angular.module('nemtu.engines', [
  ngMaterial,
  uiRouter,
  firebase,
  ngMdIcons
])
  .config(states)
  .component('engines', engines)
;
