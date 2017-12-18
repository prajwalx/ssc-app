'use strict';

angular.module('sscTestSeriesApp', ['sscTestSeriesApp.auth', 'sscTestSeriesApp.admin',
    'sscTestSeriesApp.constants', 'ngCookies', 'ngResource', 'ngSanitize', 'ngRoute',
    'btford.socket-io', 'ui.bootstrap', 'validation.match'
  ])
  .config(function($routeProvider, $locationProvider) {
    $routeProvider.otherwise({
      redirectTo: '/'
    });

    $locationProvider.html5Mode(true);
  });
