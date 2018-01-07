'use strict';
/*
Angular-Timer from:
http://siddii.github.io/angular-timer/examples.html#/angularjs-single-timer
*/
(function(){

class RuntestComponent {
  constructor($http,$rootScope,$scope,Auth) {
    this.message = 'Hello';
    this.$http=$http;
    this.$rootScope=$rootScope;
    this.$scope=$scope;
    this.Auth=Auth;

    this.page1=true;
    this.page2=false;
    this.starttest=false;
    this.hideQuestion=false;
    this.showprofile=false;
    this.showInstructionInTest=false;
    this.showQueInstructionInTest=false;
    this.showSummary=false;

    this.submitted=false;

    this.tid=sessionStorage.getItem('tid');
    this.pid=sessionStorage.getItem('opid');
    this.user;
    this.pack;
    this.test;
    this.testType;
    this.questions=[];
    this.userAnswers=[];
    this.userReviews=[];

    this.ansed;
    this.notansed;
    this.novisted;
    this.revw;

    /*
    Show NavBar on page Destroy
    */
    $scope.$on('$destroy', function() {
    this.$rootScope.hideNav=false;
    });

    /*
    On Timer Stop Submit Test If Not already submitted by User
    */
    $scope.$on('timer-stopped', function (event, data){
      console.log('Timer Stopped - data = ', data);
      console.log(event);//Traverse the complete scope Tree !Yes!
      var scope=event.targetScope.$parent.runtestCtrl;
      if(!scope.submitted){
        scope.SubmitByTimer();
      }
    });

    /*
    JS script function defined in html to load Maths of Question
    */
    $scope.$watch(function(){
      MathJax.Hub.Queue(["Typeset",MathJax.Hub],function(){
      $('#questionSection').css('visibility','');
      });
    return true;
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

  /*
  First 2 tests are free
  */
  isFreeTest(){
    for(var i in this.pack.TestIDs){
      if(i<2&&this.pack.TestIDs[i]===this.tid){
        return true;
      }
    }
    return false;
  }

  /*
  Get Test-type i.e., information of test:Marks,Duration,Qtypes,etc
  */
  GetTestType(){
    this.$http.get('/api/testtypes/'+this.test.testType)
      .then(res=>{
        this.testType=res.data;
        this.testType.Qtypes=JSON.parse(this.testType.Qtypes);

        //Initialize Section Style of Paper
        this.sectionStyling=this.testType.Qtypes[0];
      });
  }

  /*
  On: ng-click I am ready to begin Test :Start Test
  */
  startTest(form){
    if(form.$valid&&this.testType&&this.questions.length===this.testType.NoOfQu){
      this.page1=false;
      this.page2=false;
      this.VerifyTest();
      this.starttest=true;

      /*
      Start Angular-Timer
      */
      this.$scope.$broadcast('timer-start');

      //Init first question
      this.loadQuestion(0);//Load this.questions[0];
      // alert("TEST START NOW");
    }
    else if(form.$valid){
        //Show Loading till all questions Loaded Or Not LOGGED In
        if(!this.testType){
          alert('Please Login to take tests');
          location.href='/login';
        }
        else{
          console.log('questions not loaded');
          // this.GetQuestions();
          //Keep calling itself till all questions are loaded
          this.startTest(form);
        }

    }
    else
    alert('Please tick the checkbox to continue : ');
  }

  /*
  Test submitted by User Before Or OnTime
  */
  SubmitByUser(){
    var x= confirm('Are you Sure You want to Submit this Test !');//Time pauses automatically
    if(x &&!this.submitted){//If Confirmed && By any chance Timer has NOT already submitted then Submit
      this.submitted=true;//Now Timer Can't Submit
      this.$scope.$broadcast('timer-stop');//Stop The Timer
      alert('Test submitted');
      this.Calc_Exam_Summary();//Calc Score
      this.SaveTest();//Save To DB/Redirect/etc
    }
  }

  /*
  Test submitted by timer on Time Over
  */
  SubmitByTimer(){
    this.submitted=true;//Now User Can't Submit
    alert('Time Over Auto Submitting Your Test');
    this.Calc_Exam_Summary();//Calc Score
    this.SaveTest();//Save To DB/Redirect/etc
  }

  /*
  TODO:Save to DB/Redirect User/Show Performance,
      :Create Route in Server to receive data
  */
  SaveTest(){
    /*
    Save test id,examSummary,etc to user account
    Create Route in Server to receive data
    */
    //this.$http.post('')
  }

  /*
  Get All Questions of this test
  */

  GetQuestions(){

    if(this.isJson(this.test.questionIDs))
    this.test.questionIDs=JSON.parse(this.test.questionIDs);
    for( var i in this.test.questionIDs){
      this.GetThisQuest(i);
    }
    console.log(this.questions);
  }

  /*
  Get this Question Async from loop of GetQuestions()
  */

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

  /*
  On Hovering Sections LR/GK/MA/ENG
  Calc & show : answered,notansed,novisted,review of That Section
  */
  Calc_On_Hover_Section_Details(section){
    var ind=this.testType.Qtypes.indexOf(section);//0,1,2,3: LR,GK,MA,ENG
    var multiple=this.questions.length/this.testType.Qtypes.length;//100/4=25;100/1=100;
    var qi=ind*multiple;//0,25,50,75

    this.HoverSection=section;
    this.ansed=0;
    this.notansed=0;
    this.novisted=0;
    this.revw=0;
    //loop all question of this section
    for(var i=1;i<=multiple;i++){//25
      if(!this.userAnswers[qi])//Question Not loaded yet on User Screen
      this.novisted++;
      else{//Question has been Visited
        if(!this.userReviews[qi]){// Not in userReviews yet
          if(this.userAnswers[qi]!==5)
          this.ansed++;
          else
          this.notansed++;
        }//End-Not in userReviews
        else
        this.revw++;
      }//End Question Visited
      qi++;
    }//End Loop

  }//End Function

  /*
  Calc ansed,notansed,novisted,revw,wrong,correct,score OF ALL sections
  And Store in examSummary=>array of Objects
  Called on SubmitByUser(),SubmitByTimer(),ng-click=Submit
  */
  Calc_Exam_Summary(){
    var ind=0;//Start from 0=>LR
    var multiple=this.questions.length/this.testType.Qtypes.length;//100/4=25
    var totalObj = {
              ansed:0,
              notansed:0,
              novisted:0,
              revw:0,
              wrong:0,
              correct:0,
              score:0
              };
    //Initialize array of objects
    this.examSummary=[];
    for(var i=0;i<this.testType.Qtypes.length;i++){
      var qi=ind*multiple;//0,25,50,75
      var obj = {
                ansed:0,
                notansed:0,
                novisted:0,
                revw:0,
                wrong:0,
                correct:0,
                score:0
                };

                //loop all question of this section
                for(var j=1;j<=multiple;j++){//25
                  if(!this.userAnswers[qi])//Not loaded yet
                  obj.novisted++;
                  else{//Question has been Visited
                    if(!this.userReviews[qi]){// Not in userReviews yet
                      if(this.userAnswers[qi]!==5){
                        obj.ansed++;
                        if((this.userAnswers[qi]*1)===this.questions[qi].ans)//If [ans*1=(int)ans] equals [(int)ans(FROM DB)]
                        obj.correct++;//ans is correct
                        else
                        obj.wrong++;//ans is wrong
                      }
                      else
                      obj.notansed++;
                    }//End-Not in userReviews
                    else{
                      obj.revw++;
                      if(this.userAnswers[qi]!==5){
                        if((this.userAnswers[qi]*1)===this.questions[qi].ans)//If [ans*1=(int)ans] equals [(int)ans(FROM DB)]
                        obj.correct++;//ans is correct
                        else
                        obj.wrong++;//ans is wrong
                      }
                    }

                  }//End Question Visited
                  qi++;//0->24,25->49,50->74,75->99
                }//End Inner-Loop
      ind++;//0->1->2->3

      obj.score=(this.testType.PositiveMark*obj.correct)-(this.testType.NegativeMark*obj.wrong);

      /*
      Add Data to total Data
      */
      totalObj.ansed+=obj.ansed;
      totalObj.notansed+=obj.notansed;
      totalObj.novisted+=obj.novisted;
      totalObj.revw+=obj.revw;
      totalObj.wrong+=obj.wrong;
      totalObj.correct+=obj.correct;
      totalObj.score+=obj.score

      //Push Section Obj to array
      this.examSummary.push(obj);
    }//End-Loop

    //Push totalObj to array
    this.examSummary.push(totalObj);
    console.log(this.examSummary);
  }//End Function

  /*
  Ng-click top Section:LR,GK,MA,ENG
  */
  section(section){
    //Load this section Logic here

    //Load first question of this Section
    var ind=this.testType.Qtypes.indexOf(section);//0,1,2,3: LR,GK,MA,ENG
    var multiple=this.questions.length/this.testType.Qtypes.length;//100/4=25;100/1=100;
    //0-24 => 25 Questions
    //Qno to display only:This is index ,Increment by one in HTML
    this.loadQuestion(ind*multiple);//0,25,50,75
  }

  /*
  Load A Question onto Screen During Test
  */
  loadQuestion(index){
    this.activeQuestion=this.questions[index];
    this.activeQuestion.qno=index;
    //hide the visibility of question till MathJax Renders it in scope.$watch function
    $('#questionSection').css('visibility','hidden');

    //Apply sectionStyling to top sections
    this.sectionStyling=this.questions[index].questype;

    // If answered by user ,save&next OR mark&next then set that radio ans,else Init all ans by 5,ie.Not Attempted
    if(this.userAnswers[index]&&this.userAnswers[index]!==5)//if exists in answers and is not=5 ,i.e.1 of 4 is chosen
    this.UserAns=this.userAnswers[index];//Bind chosen answer to radio ng-model
    else{
    this.UserAns=5;//Init empty radio ans
    this.userAnswers[index]=5;//Init empty radio ans
    }
  }
  // todo: Create a User,Test Object to store answers of users,testId,etc

  /*
  Ng Click Save&Next Save the Ans By User And Load Next Question in loop,ie Last jumps to First Question
  */
  SaveAndNext(index){
    //Save The Radio ng-model;Default is 5(Not Attempted)
    this.userAnswers[index]=this.UserAns;
    //If it's not last question
    if(index!==(this.questions.length-1))
    this.loadQuestion(index+1);//Load Next Question

    else//It is last Question
    this.loadQuestion(0);//Load First Question

    console.log(this.userAnswers);
  }

  /*
  Clear The Previously Selected Ans And Save The Changes
  */
  ClearResponse(index){
    this.UserAns=5;//Clear Ng-Model
    this.userAnswers[index]=5;//Clear User Answers to Not answered
  }

  //Helper Functions

  /*
  Is The String JSON string ;
  To avoid JSON.parse on already parsed Data
  */
   isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
  }

  /*
  Pre Load Images Before Starting Test
  */
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
