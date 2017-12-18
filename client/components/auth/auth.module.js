'use strict';

angular.module('sscTestSeriesApp.auth', ['sscTestSeriesApp.constants', 'sscTestSeriesApp.util',
    'ngCookies', 'ngRoute'
  ])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
