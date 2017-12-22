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
  constructor() {
    this.message = 'Hello';
  }
}

angular.module('sscTestSeriesApp')
  .component('addtest', {
    templateUrl: 'app/addtest/addtest.html',
    controller: AddtestComponent,
    controllerAs: 'addtestCtrl'
  });

})();
