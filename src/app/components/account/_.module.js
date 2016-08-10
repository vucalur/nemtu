import angular from 'angular';
import uiRouter from 'angular-ui-router';
import firebase from 'angularfire';

import {routerConfig} from './_.route.js';
import {AuthService} from './auth/service.js';
import LoginController from './login/controller.js';

export default angular.module('nemtu.account', [
  uiRouter,
  firebase
])
  .config(routerConfig)
  .controller('LoginController', LoginController)
  .service('authService', AuthService)
;
