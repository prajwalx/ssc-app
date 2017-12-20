'use strict';

angular.module('sscTestSeriesApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/forgot', {
        template: '<forgot></forgot>'
      })
      .when('/reset/:token', {
        templateUrl: 'app/forgot/reset/reset.html',
        controller: 'ResetController',
        controllerAs: 'rc',
        resolve: {
            token: function ($route) {
                return $route.current.params.token;
            }
        }
      });
  });
