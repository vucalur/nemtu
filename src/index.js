import angular from 'angular';
import ngAnimate from 'angular-animate';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import uiRouter from 'angular-ui-router';
import firebase from 'angularfire';
import ngMaterial from 'angular-material';
import ngMdIcons from 'angular-material-icons';

import {config, urlsConfig} from './_.config';
import navbar from './app/navbar/navbar.component';

import Paged from "./app/firebaseData/paged.service";
import Root from './app/firebaseData/root.service';
import Engines from "./app/firebaseData/engines.serivce";
import Channels from "./app/firebaseData/channels.service";
import Articles from "./app/firebaseData/articles.service";

import AccountModule from './app/account/_.ng-module';
import EnginesModule from './app/engines/_.ng-module';
import ChannelsModule from './app/channels/_.ng-module';

// Material design css
import 'angular-material/angular-material.css';
import 'angular-material-icons/angular-material-icons.css';

import './index.scss';

angular.module('nemtu', [
  // angular
  ngMaterial,
  ngAnimate,
  ngCookies,
  ngResource,

  // 3rd party
  uiRouter,
  firebase,
  ngMdIcons,

  // nemtu
  AccountModule.name,
  EnginesModule.name,
  ChannelsModule.name
])
  .config(config)
  .config(urlsConfig)
  .component('nmtNavbar', navbar)
  .service('Paged', Paged)
  .service('Root', Root)
  .service('Engines', Engines)
  .service('Channels', Channels)
  .service('Articles', Articles)
;
