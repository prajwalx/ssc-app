'use strict';

angular.module('sscTestSeriesApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/edittest', {
        template: '<edittest></edittest>'
      });
  });
