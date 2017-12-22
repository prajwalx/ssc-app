'use strict';

angular.module('sscTestSeriesApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/addtest', {
        template: '<addtest></addtest>'
      });
  });
