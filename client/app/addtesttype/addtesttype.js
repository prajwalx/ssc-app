'use strict';

angular.module('sscTestSeriesApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/addtesttype', {
        template: '<addtesttype></addtesttype>'
      });
  });
