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
    this.questStr;
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

  Create(form){
    this.submitted=true;
    if(form.$valid&&this.myquestions.length===this.SelectedTestType.NoOfQu){
      this.SortQuestions();
      this.$http.post('/api/tests',{
        testTitle:this.InputTestName,
        testType:this.SelectedTestType._id,//Id of TestType
        questionIDs:this.questStr//JSON string of Array of QIDS
      })
      .then(response=>{
        alert('Added');
        location.href='/addtest';//Simply Reset Page
      });
    }
  }

  /*
  Sort Questions IDS in order of QuesTypes into JSON String
  */
  SortQuestions(){
    var arr=[];
    for(var i in this.SelectedTestType.Qtypes){
      for(var j in this.myquestions){
        if(this.myquestions[j].questype===this.SelectedTestType.Qtypes[i])
        arr.push(this.myquestions[j]._id);
      }//end-for-loop2
    }//end-for-loop1
    console.log(this.myquestions);
    console.log(arr);
    this.questStr=angular.toJson(arr);
  }//end SortQuestions

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
  And Default Select first Qtype for DOM ng-filter
  */
  Reload(){
    //ng-filter-init
    this.SelectedQTypeDOM=this.SelectedTestType.Qtypes[0];

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
