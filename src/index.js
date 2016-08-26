import angular from 'angular';
import ngAnimate from 'angular-animate';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';
import uiRouter from 'angular-ui-router';
import firebase from 'angularfire';
import ngMaterial from 'angular-material';
// TODO(vucalur): find alternative to angular-material-icons
// import ngMdIcons from 'material-design-icons';

import {config} from './config';
import {routesConfig, authRequiredRedirect} from './routes';
import navbar from './app/components/navbar/component';
import FirebaseDataService from './app/components/firebaseData/firebaseData.service';

import AccountModule from './app/components/account/_.module';
import EnginesModule from './app/components/engines/_.module';
import ChannelsModule from './app/components/channels/_.module';

// Material design css
import 'angular-material/angular-material.css';

import './index.scss';

angular.module('nemtu', [
  // angular
  ngMaterial,
  ngAnimate,
  ngCookies,
  ngSanitize,
  ngResource,

  // 3rd party
  uiRouter,
  firebase,
  // TODO(vucalur): find alternative to angular-material-icons
  // ngMdIcons,

  // nemtu
  AccountModule.name,
  EnginesModule.name,
  ChannelsModule.name
])
  .config(config)
  .config(routesConfig)
  .run(authRequiredRedirect)
  .component('nmtNavbar', navbar)
  .service('firebaseDataService', FirebaseDataService)
;
