import {routerConfig} from './_.route.js';
import {AuthService} from './auth/auth.service.js';
import {LoginController} from './login/login.controller.js';

angular.module('nemtu.account', [
  'nemtu',

  'ui.router',
  'firebase'
])
  .config(routerConfig)
  .controller('LoginController', LoginController)
  .service('authService', AuthService)
;
