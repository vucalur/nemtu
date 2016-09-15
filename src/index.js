import angular from 'angular';
import ngAnimate from 'angular-animate';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import uiRouter from 'angular-ui-router';
import firebase from 'angularfire';
import ngMaterial from 'angular-material';
import ngMdIcons from 'angular-material-icons';

import {config} from './config';
import {routesConfig, authRequiredRedirect} from './routes';
import navbar from './app/navbar/component';

import Paged from "./app/firebaseData/paged.service";
import Root from './app/firebaseData/root.service';
import Engines from "./app/firebaseData/engines.serivce";
import Channels from "./app/firebaseData/channels.service";
import Channel from "./app/firebaseData/channel.service";

import AccountModule from './app/account/_.module';
import EnginesModule from './app/engines/_.module';
import ChannelsModule from './app/channels/_.module';

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
  .config(routesConfig)
  .run(authRequiredRedirect)
  .component('nmtNavbar', navbar)
  .service('Paged', Paged)
  .service('Root', Root)
  .service('Engines', Engines)
  .service('Channels', Channels)
  .service('Channel', Channel)
;
