/* global Firebase:false */

import {config} from './index.config';
import {routerConfig} from './index.route';
import {runBlock} from './index.run';
import {consts} from './index.consts';
import {NavbarDirective} from './components/navbar/navbar.directive';
import {FirebaseDataService} from './components/firebaseData/firebaseData.service';

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
  'nemtu.account',
  'nemtu.feeds',
  'nemtu.engines'
])
  .config(config)
  .config(routerConfig)
  .run(runBlock)
  .constant('FIREBASE_URL', consts.FIREBASE_URL)
  .constant('Firebase', Firebase)
  .directive('nmtNavbar', NavbarDirective)
  .service('firebaseDataService', FirebaseDataService)
;
