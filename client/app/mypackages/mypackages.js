'use strict';

angular.module('sscTestSeriesApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/mypackages', {
        template: '<mypackages></mypackages>'
      });
  });
