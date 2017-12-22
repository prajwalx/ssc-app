'use strict';
/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/questions              ->  index
 * POST    /api/questions              ->  create
 * GET     /api/questions/:id          ->  show
 * PUT     /api/questions/:id          ->  update
 * DELETE  /api/questions/:id          ->  destroy
 */

(function(){

class AddquestionComponent {
  constructor($http,socket,$scope) {
    this.message = 'Hello';
    this.$http=$http;
    this.socket=socket;

    this.create=true;
    this.questypes=[];
    this.Questions=[];
    this.QuestionId;

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('question');
    });

  }

  $onInit(){
    this.$http.get('/api/questypes')
    .then(response=>{
      var typearr=response.data;
      var arr=[];
      typearr.forEach( function (arrayItem)
        {
          arr.push(arrayItem.Qtype);
          //alert(x);
      });
      this.questypes=arr;
    });

    this.$http.get('/api/questions')
    .then(response=>{
      this.Questions=response.data;
      this.socket.syncUpdates('question', this.Questions);
    })
  }

  Create(form){
    this.submitted=true;
    console.log(form);
    if(form.$valid){
      console.log(this.Ans);
      this.$http.post('/api/questions',{
        question:this.Inputquestion,
        questype:this.questionType,
        quesImg:this.InputquestionURL,//URL Amazon S3 CDN
        a:this.OptionA,//1
        b:this.OptionB,//2
        c:this.OptionC,//3
        d:this.OptionD,//4
        ans:this.Ans,//1,2,3,4
        solution:this.Solution,//URL
        solutionImg:this.SolutionURL
      })
      .then(response=>{
        this.submitted=false;
        this.Inputquestion='';
        this.InputquestionURL='';
        this.questionType='';
        this.OptionA='';
        this.OptionB='';
        this.OptionC='';
        this.OptionD='';
        this.Ans='';
        this.Solution='';
        this.SolutionURL='';
      });
    }
  }

  loadForUpdate(question){
    console.log(question);
    this.Inputquestion=question.question;
    this.InputquestionURL=question.quesImg;
    this.questionType=question.questype;
    this.OptionA=question.a;
    this.OptionB=question.b;
    this.OptionC=question.c;
    this.OptionD=question.d;
    this.Ans=question.ans;
    this.Solution=question.solution
    this.SolutionURL=question.solutionImg
    this.create=false;
    this.QuestionId=question._id;
  }

  Update(form){
    this.submitted=true;
    if(form.$valid){

      this.$http.put('/api/questions/'+this.QuestionId,{
        question:this.Inputquestion,
        questype:this.questionType,
        quesImg:this.InputquestionURL,//URL Amazon S3 CDN
        a:this.OptionA,//1
        b:this.OptionB,//2
        c:this.OptionC,//3
        d:this.OptionD,//4
        ans:this.Ans,//1,2,3,4
        solution:this.Solution,//URL
        solutionImg:this.SolutionURL
      })
      .then(response=>{
        this.submitted=false;
        this.Inputquestion='';
        this.InputquestionURL='';
        this.questionType='';
        this.OptionA='';
        this.OptionB='';
        this.OptionC='';
        this.OptionD='';
        this.Ans='';
        this.Solution='';
        this.SolutionURL='';
        this.create=true;//Set Page to Default
      });

    }

  }

  Delete(question){
    var x=confirm('Are you Sure you want to delete this Question ?');
    if(x){
      this.$http.delete('/api/questions/'+question._id);
    }
  }

}//class ends

angular.module('sscTestSeriesApp')
  .component('addquestion', {
    templateUrl: 'app/addquestion/addquestion.html',
    controller: AddquestionComponent,
    controllerAs: 'addquestionCtrl'
  });

})();
