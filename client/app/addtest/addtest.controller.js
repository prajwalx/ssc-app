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

    this.testTypes=[];
    this.allquestions=[];
    this.myquestions=[];
  }

  $onInit(){

    this.$http.get('/api/testtypes')
    .then(response=>{
        this.testTypes=response.data;
        for(var i=0;i<this.testTypes.length;i++){
        this.testTypes[i].Qtypes=JSON.parse(this.testTypes[i].Qtypes);
        }

    });

    //Get All Questions
    this.$http.get('/api/questions')
      .then(response=>{
        this.allquestions=response.data;
      });
  }

}//End Class


angular.module('sscTestSeriesApp')
  .component('addtest', {
    templateUrl: 'app/addtest/addtest.html',
    controller: AddtestComponent,
    controllerAs: 'addtestCtrl'
  });

})();
