import angular from 'angular';
import uiRouter from 'angular-ui-router';
import firebase from 'angularfire';

import {routerConfig} from './_.states';
import {AuthService} from './auth/auth.service';
import login from './login/login.component';

export default angular.module('nemtu.account', [
  uiRouter,
  firebase
])
  .config(routerConfig)
  .component('login', login)
  .service('AuthService', AuthService)
;
