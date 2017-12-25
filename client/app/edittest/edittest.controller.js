'use strict';
//FOR UNDERSTANDING THIS CODE FIRST UNDERSTAND 'addtest.controller.js'
//This is 90% same but with edit facility and table showing tests

//Major Diff loadForEdit(),GetAndSetTypeByID(),Load_MyQuestions_And_AllQuestions()

//Currently Stable
//Possible errors If in Future then:Lookout for follow:
// TODO: WatchOut if http put gets called before SortQuestions()
// TODO: WatchOut Load_MyQuestions_And_AllQuestions() for Large Number of allquestions[]
(function(){

class EdittestComponent {
  constructor($http,$scope,socket) {
    this.message = 'Hello';
    this.$http=$http;
    this.$scope=$scope;
    this.socket=socket;

    this.myquestions=[];
    this.allquestions=[];
    this.testTypes=[];
    this.questStr;

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('test');
    });

  }

  $onInit(){
    //Get all tests
    this.$http.get('/api/tests')
      .then(response=>{
        this.tests=response.data;
        this.socket.syncUpdates('test', this.tests);

        // get Test Type Details for Each test and set as ObjTestType of tests[i]
        for(var i in this.tests){
          this.GetAndSetTypeByID(i);
        }

      });

      //For Edit ng-options, Default Population of Select
      this.$http.get('/api/testtypes')
      .then(response=>{
          this.testTypes=response.data;
          for(var i=0;i<this.testTypes.length;i++){
          this.testTypes[i].Qtypes=JSON.parse(this.testTypes[i].Qtypes);
          }
      });

  }//end-$onInit
  /*
    Don't make functions inside of a loop ...
    Each call of your function is actually referencing the same copy of i in memory.
    A new closure is created each time the for loop runs, but each one captures the same environment.
    Therefore, every call to $http.get (an asynchronous function) results in the firing of a callback
     referencing the same final value of i from the end of loop.
    A solution:
    Pass i as a parameter to a separately defined function:
  */
  GetAndSetTypeByID(i){
    this.$http.get('/api/testtypes/'+this.tests[i].testType)//Get TestType of tests[i]
        .then(response=>{
          this.tests[i].ObjTestType=response.data;//create new field in tests[i] to store its type

          //Question Types of this testType are a JSON string of array:'[LR,GK,MA]'
          this.tests[i].ObjTestType.Qtypes=JSON.parse(this.tests[i].ObjTestType.Qtypes);
        });
  }

  /*
  Delete a Test
  */
  Delete(test){
    var x=confirm('Are you sure you want to delete: '+test.testTitle+' !');
    if(x){
      this.$http.delete('/api/tests/'+test._id);
    }
  }
  /*
  Update a Test
  */
  Update(form){
    this.submitted=true;
    if(form.$valid&&this.myquestions.length===this.SelectedTestType.NoOfQu){
      this.SortQuestions();//Sort Questions in Order defined in TestType
      this.$http.put('/api/tests/'+this.UpdateId,{
        testTitle:this.InputTestName,//Title of Test
        testType:this.SelectedTestType._id,//Id of TestType
        questionIDs:this.questStr//JSON string of Array of QIDS
      })
      .then(response=>{
        alert('Updated');
        location.href='/edittest';//Simply Reset Page
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
    this.questStr=angular.toJson(arr);
  }//end SortQuestions

  /*
  toggleQ from all questypes to SelectedQuesTypes and vice-versa
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
  Load a test for Editing
  */

  loadForEdit(test){
    this.UpdateId=test._id;//Store Id
    this.InputTestName=test.testTitle;//Set Name to ng-model

    this.SelectedTestType=test.ObjTestType;//Set testType for Select ng-model
    //Dom of first qtype Selected default
    //this.SelectedQTypeDOM=this.SelectedTestType.Qtypes[0];

    this.myquestions=[];//Empty my questions
    this.allquestions=[];//Empty all questions

    //Get All Questions
    this.$http.get('/api/questions')
      .then(response=>{
        this.allquestions=response.data;
        //test.questionIDs is array of question's IDs of a test ,stored as JSON String in DB
        var qids=JSON.parse(test.questionIDs);
        for(var i in qids){
        //Add each question of this test in myquestions and remove from allquestions
        this.Load_MyQuestions_And_AllQuestions(qids[i]);
        }
      });
  }//End-Load-for-Edit

  /*
  Add each question of this test in myquestions and remove from allquestions
  */

  Load_MyQuestions_And_AllQuestions(id){
    this.$http.get('/api/questions/'+id)//Get a question
      .then(response=>{
        this.myquestions.push(response.data);//add question to myquestions
        for(var z in this.allquestions){//Loop through allquestions
          if(this.allquestions[z]._id===id){//If question id matches
            this.allquestions.splice(z,1);//Delete Question
            break;//Exit Loop
          }//end-if
        }//end-loop
      });//end-http get
  }//end- Load_MyQuestions_And_AllQuestions

}//End-Class

angular.module('sscTestSeriesApp')
  .component('edittest', {
    templateUrl: 'app/edittest/edittest.html',
    controller: EdittestComponent,
    controllerAs: 'edittestCtrl'
  });

})();
