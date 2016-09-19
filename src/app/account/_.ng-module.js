import angular from 'angular';
import uiRouter from 'angular-ui-router';
import firebase from 'angularfire';

import authHookRunBlock from './auth/requiresAuth.hook';
import states from './_.states';
import AuthService from './auth/auth.service';
import login from './login/login.component';

export default angular.module('nemtu.account', [
  uiRouter,
  firebase
])
  .run(authHookRunBlock)
  .config(states)
  .component('login', login)
  .service('AuthService', AuthService)
;
