'use strict';

angular.module('sscTestSeriesApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/addquestion', {
        template: '<addquestion></addquestion>'
      });
  });
