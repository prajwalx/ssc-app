'use strict';

angular.module('sscTestSeriesApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/editpack', {
        template: '<editpack></editpack>'
      });
  });
