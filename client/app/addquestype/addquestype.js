'use strict';

angular.module('sscTestSeriesApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/addquestype', {
        template: '<addquestype></addquestype>'
      });
  });
