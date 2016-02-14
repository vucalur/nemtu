/* global Firebase:false */

import { config } from './index.config';
import { routerConfig } from './index.route';
import { runBlock } from './index.run';
import { consts } from './index.consts';
import { MainController } from './main/main.controller';
import { NavbarDirective } from '../app/components/navbar/navbar.directive';
import { FirebaseDataService } from '../app/components/firebaseData/firebaseData.service';

angular.module('nemtu', [
    // angular
    'ngAnimate',
    'ngCookies',
    'ngSanitize',
    'ngResource',

    // 3rd party
    'ui.router',
    'ngMaterial',
    'firebase',
    'ngMdIcons',

    // nemtu
    'nemtu.account'
  ])
  .config(config)
  .config(routerConfig)
  .run(runBlock)
  .constant('FIREBASE_URL', consts.FIREBASE_URL)
  .constant('Firebase', Firebase)
  .controller('MainController', MainController)
  .directive('nmtNavbar', NavbarDirective)
  .service('firebaseDataService', FirebaseDataService)
;
