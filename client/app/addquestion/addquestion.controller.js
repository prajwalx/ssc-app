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
    this.counter=[];//counts no of uploads

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('question');
      socket.unsyncUpdatesQuestionUpload();//Remove Listener for `UploadSuccess` // TODO: Remove this function if Unnecessary
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
    });

    this.counter.push(0);//counter={0,NULL}//array of size 1
  }

  AllUploaded(){
    var qurl=( $('.img-upload').eq(0).parents('.form-group').find(':text').val()),
        aurl=( $('.img-upload').eq(1).parents('.form-group').find(':text').val()),
        burl=( $('.img-upload').eq(2).parents('.form-group').find(':text').val()),
        curl=( $('.img-upload').eq(3).parents('.form-group').find(':text').val()),
        durl=( $('.img-upload').eq(4).parents('.form-group').find(':text').val()),
        surl=( $('.img-upload').eq(5).parents('.form-group').find(':text').val());
    var count=0;
    if(qurl!=='')count++;
    if(aurl!=='')count++;
    if(burl!=='')count++;
    if(curl!=='')count++;
    if(durl!=='')count++;
    if(surl!=='')count++;

    if (this.counter[0]>=count)
    return true;
    else alert('Upload All Files');
    return false;
  }

  Create(form){
    this.submitted=true;
    console.log(form);
    if(form.$valid&&this.AllUploaded()){
      console.log(this.Ans);
      this.$http.post('/api/questions',{
        question:this.Inputquestion,
        questype:this.questionType,
        quesImg:encodeURIComponent(( $('.img-upload').eq(0).parents('.form-group').find(':text').val()).trim()),//URL Amazon S3 CDN
        a:this.OptionA,//1
        b:this.OptionB,//2
        c:this.OptionC,//3
        d:this.OptionD,//4
        aURL:encodeURIComponent(( $('.img-upload').eq(1).parents('.form-group').find(':text').val()).trim()),
        bURL:encodeURIComponent(( $('.img-upload').eq(2).parents('.form-group').find(':text').val()).trim()),
        cURL:encodeURIComponent(( $('.img-upload').eq(3).parents('.form-group').find(':text').val()).trim()),
        dURL:encodeURIComponent(( $('.img-upload').eq(4).parents('.form-group').find(':text').val()).trim()),
        ans:this.Ans,//1,2,3,4
        solution:this.Solution,//URL
        solutionImg:encodeURIComponent(( $('.img-upload').eq(5).parents('.form-group').find(':text').val()).trim())
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
        this.OptionAURL='';
        this.OptionBURL='';
        this.OptionCURL='';
        this.OptionDURL='';
        this.Ans='';
        this.Solution='';
        this.SolutionURL='';
        location.reload();//reload page after Posting Data
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
    this.OptionAURL=question.aURL;
    this.OptionBURL=question.bURL;
    this.OptionCURL=question.cURL;
    this.OptionDURL=question.dURL;
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
        aURL:this.OptionAURL,
        bURL:this.OptionBURL,
        cURL:this.OptionCURL,
        dURL:this.OptionDURL,
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
        this.OptionAURL='';
        this.OptionBURL='';
        this.OptionCURL='';
        this.OptionDURL='';
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

  upload(ind){
    //dirty way of getting source of image
    var image=$('.img-upload').eq(ind).attr('src');
    var textField = $('.img-upload').eq(ind).parents('.form-group').find(':text');
    var format=textField.val();
    //format = abc.png
    var index=(format.lastIndexOf('.')+1);
    format=format.substring(index);//format = png
    var name=textField.val().substring(0,index-1);//name = abc

    //socket function defined in components/socket.service client side
    this.socket.UploadImageToServer(image,format,name,this.counter);//updates counter array value ++ on upload

  }

}//class ends

angular.module('sscTestSeriesApp')
  .component('addquestion', {
    templateUrl: 'app/addquestion/addquestion.html',
    controller: AddquestionComponent,
    controllerAs: 'addquestionCtrl'
  });

})();
