'use strict';

angular.module('sscTestSeriesApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/runtest', {
        template: '<runtest></runtest>'
      });
  });
