'use strict';

angular.module('sscTestSeriesApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/addpack', {
        template: '<addpack></addpack>'
      });
  });
