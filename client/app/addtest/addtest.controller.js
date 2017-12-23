'use strict';
/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/tests              ->  index
 * POST    /api/tests              ->  create
 * GET     /api/tests/:id          ->  show
 * PUT     /api/tests/:id          ->  update
 * DELETE  /api/tests/:id          ->  destroy
 */

(function(){

class AddtestComponent {
  constructor($http,socket,$scope) {
    this.message = 'Hello';
    this.$http=$http;
    this.socket=socket;
    this.$scope=$scope;    
  }
}

angular.module('sscTestSeriesApp')
  .component('addtest', {
    templateUrl: 'app/addtest/addtest.html',
    controller: AddtestComponent,
    controllerAs: 'addtestCtrl'
  });

})();
