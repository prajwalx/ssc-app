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


  /*
  toggleQ from all questypes to electedQuesTypes and vice-versa
  */
  toggleQ(x){
    console.log(x);
    if(this.allquestions.indexOf(x)!==-1){
      this.myquestions.push(x);//add to myquestions
      this.allquestions.splice(this.allquestions.indexOf(x),1);//pop from total allquestions
    }
    else{
      this.allquestions.push(x);//add to all questypes
      this.myquestions.splice(this.myquestions.indexOf(x),1);//pop from myquestions
    }
  }

  /*
  ReSet myquestions and allquestions if ng-change on select 
  */
  Reload(){

    var tempAll=this.allquestions;
    var tempMy=this.myquestions;
    for(var x in tempMy){
      tempAll.push(tempMy[x]);
    }
    tempMy.length=0;
    this.myquestions.length=0;
    this.allquestions=tempAll;
    console.log(tempAll);
    console.log(tempMy);
  }

}//End Class


angular.module('sscTestSeriesApp')
  .component('addtest', {
    templateUrl: 'app/addtest/addtest.html',
    controller: AddtestComponent,
    controllerAs: 'addtestCtrl'
  });

})();
