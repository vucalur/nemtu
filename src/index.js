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
import navbar from './app/navbar/component';

import Root from './app/firebaseData/root.service';
import Engines from "./app/firebaseData/engines.serivce";
import Channels from "./app/firebaseData/channels.service";

import AccountModule from './app/account/_.module';
import EnginesModule from './app/engines/_.module';
import ChannelsModule from './app/channels/_.module';

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
  .service('Root', Root)
  .service('Engines', Engines)
  .service('Channels', Channels)
;
