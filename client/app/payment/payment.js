'use strict';

angular.module('sscTestSeriesApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/payment', {
        template: '<payment></payment>'
      });
  });
