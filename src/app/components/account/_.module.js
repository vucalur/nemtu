import angular from 'angular';
import uiRouter from 'angular-ui-router';
import firebase from 'angularfire';

import {routerConfig} from './_.route';
import {AuthService} from './auth/service';
import LoginController from './login/controller';

export default angular.module('nemtu.account', [
  uiRouter,
  firebase
])
  .config(routerConfig)
  .controller('LoginController', LoginController)
  .service('authService', AuthService)
;
