'use strict';

(function(){

class RuntestComponent {
  constructor($http,$rootScope,$scope,Auth) {
    this.message = 'Hello';
    this.$http=$http;
    this.$rootScope=$rootScope;
    this.Auth=Auth;

    this.tid=sessionStorage.getItem('tid');
    this.pid=sessionStorage.getItem('opid');
    this.user;
    this.pack;
    this.test;
    this.testType;

    this.$rootScope.hideNav=true;
    this.page1=true;

    $scope.$on('$destroy', function() {
    this.$rootScope.hideNav=false;
    });
  }

  $onInit(){
    this.$http.get('/api/packs/'+this.pid)
      .then(res=>{
        this.pack=res.data;
        this.pack.TestIDs=JSON.parse(this.pack.TestIDs);
      });

    this.$http.get('/api/tests/'+this.tid)
      .then(res=>{
        this.test=res.data;
        this.GetTestType();
      });

    this.Auth.getCurrentUser(function (usr){
      console.log('SAMPLE LOG');
     })
      .then(user=>{
        this.user=user;
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
          alert('Dont Hack This , If found Again a Case of 20,00,000 to be Registered to '+user.email);
          location.href='/';
        }
        else{
        console.log('VTEST');
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
      });
  }

  startTest(form){
    if(form.$valid){
      this.page1=false;
      this.page2=false;
      this.VerifyTest();
      alert("TEST START NOW");
    }

    else
    alert('Please tick the checkbox to continue : ');
  }

}//End Class

angular.module('sscTestSeriesApp')
  .component('runtest', {
    templateUrl: 'app/runtest/runtest.html',
    controller: RuntestComponent,
    controllerAs: 'runtestCtrl'
  });

})();
