'use strict';

(function(){

class RuntestComponent {
  constructor($http,$rootScope,$scope,Auth) {
    this.message = 'Hello';
    this.$http=$http;
    this.$rootScope=$rootScope;
    this.Auth=Auth;

    this.page1=true;
    this.page2=false;
    this.starttest=false;

    this.tid=sessionStorage.getItem('tid');
    this.pid=sessionStorage.getItem('opid');
    this.user;
    this.pack;
    this.test;
    this.testType;
    this.questions=[];

    $scope.$on('$destroy', function() {
    this.$rootScope.hideNav=false;
    });
  }

  $onInit(){

    if(this.pid&&this.tid){

      this.$http.get('/api/packs/'+this.pid)
        .then(res=>{
          this.pack=res.data;
          this.pack.TestIDs=JSON.parse(this.pack.TestIDs);
        });
      this.$http.get('/api/tests/'+this.tid)
        .then(res=>{
          this.test=res.data;
          this.GetTestType();
          this.AuthVerification();
        });
    }

  }//end-OnInit

  AuthVerification(){
    this.Auth.getCurrentUser(function (usr){
      console.log('SAMPLE LOG');
     })
      .then(user=>{
        this.user=user;
        this.$rootScope.hideNav=true;//Show Purple NavBar
        this.VerifyTest();
      });
  }

  VerifyTest(){//Is the pack id in user.packIDs,ie. Has the user Purchased this Pack
    this.$http.post('/api/myuser/GetUser',{
      pid:this.pid,
      uid:this.user._id
    })
      .then(res=>{
        if((!res.data)&&(!this.isFreeTest()) ){
          alert('Damm! It seems you are not Authorized to take this test.Sigh!.');
          location.href='/';
        }
        else{
        console.log('VTEST');
        this.GetQuestions();
        }

      });
  }
  isFreeTest(){
    for(var i in this.pack.TestIDs){
      if(i<2&&this.pack.TestIDs===this.tid)
      return true;
    }
    return false;
  }

  GetTestType(){
    this.$http.get('/api/testtypes/'+this.test.testType)
      .then(res=>{
        this.testType=res.data;
        this.testType.Qtypes=JSON.parse(this.testType.Qtypes);

        //Initialize Section Style of Paper
        this.sectionStyling=this.testType.Qtypes[0];
      });
  }

  startTest(form){
    if(form.$valid&&this.testType&&this.questions.length===this.testType.NoOfQu){
      this.page1=false;
      this.page2=false;
      this.VerifyTest();
      this.starttest=true;
      //Init first question
      this.activeQuestion=this.questions[0];
      this.activeQuestion.qno=0;
      // alert("TEST START NOW");
    }
    else if(form.$valid){
        //Show Loading till all questions Loaded Or Not LOGGED In
        if(!this.testType){
          alert('Please Login to take tests');
          location.href='/login';
        }
        else
        console.log('questions not loaded');
        // this.GetQuestions();
    }
    else
    alert('Please tick the checkbox to continue : ');
  }

  section(section){
    //Load this section Logic here
  }

  GetQuestions(){

    if(this.isJson(this.test.questionIDs))
    this.test.questionIDs=JSON.parse(this.test.questionIDs);
    for( var i in this.test.questionIDs){
      this.GetThisQuest(i);
    }
    console.log(this.questions);
  }

  GetThisQuest(i){
    this.$http.get('/api/questions/'+this.test.questionIDs[i])
      .then(res=>{
        this.questions[i]=res.data;
        this.preloadImage(res.data.quesImg);
        this.preloadImage(res.data.aURL);
        this.preloadImage(res.data.bURL);
        this.preloadImage(res.data.cURL);
        this.preloadImage(res.data.dURL);
      });
  }

  //Helper Functions
   isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
  }
  //preloadImage
   preloadImage(url){
     if(url!==''){
    var img=new Image();
    img.src=url;
    }
  }

}//End Class

angular.module('sscTestSeriesApp')
  .component('runtest', {
    templateUrl: 'app/runtest/runtest.html',
    controller: RuntestComponent,
    controllerAs: 'runtestCtrl'
  });

})();
