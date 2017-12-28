'use strict';

angular.module('sscTestSeriesApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/viewpack', {
        template: '<viewpack></viewpack>',
        authenticate:'user'
      });
  });
