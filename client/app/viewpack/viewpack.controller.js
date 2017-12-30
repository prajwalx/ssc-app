'use strict';

(function(){

class ViewpackComponent {
  constructor($http,Auth) {
    this.message = 'Hello';
    this.$http=$http;
    this.opid=sessionStorage.getItem('opid');
    this.Auth=Auth;

    this.pack;
    this.tests=[];
    this.p=false;
  }
  $onInit(){

    if(this.opid){

        this.$http.get('/api/packs/'+this.opid)
          .then(response=>{
            this.pack=response.data;
            this.pack.TestIDs=JSON.parse(this.pack.TestIDs);

            for(var i in this.pack.TestIDs){
              this.GetTest(i);
              }
          });

        this.Auth.getCurrentUser(function(usr){
          console.log(usr);
        }).then(res=>{
          this.GetUser(res._id);
        });


    }
  }
  GetUser(id){
    this.$http.post('/api/myuser/GetUser',{
      uid:id,
      pid:this.opid
    })
    .then(response=>{
      //console.log(response.data);
      if(response.data==='2')
      this.p=true;
      else
      this.p=false;
      //console.log(this.p);
    });
  }
  GetTest(i){
    this.$http.get('/api/tests/'+this.pack.TestIDs[i])
      .then(response=>{
        this.tests[i]=response.data;
        if(i<=0){
        this.GetTestType();//All Tests are of Same type
        }
      });
  }

  GetTestType(){
    //GetTestType
    this.$http.get('/api/testtypes/'+this.tests[0].testType)
      .then(response=>{
        this.pack.testType=response.data
        console.log(this.pack);
      });
  }

  buy(){
    sessionStorage.setItem('pid',this.opid);
    location.href='/payment';
  }
  Attempt(t,ind){
    if(this.p||ind<2){
      sessionStorage.setItem('tid',t._id);
      //alert('Now Test');
      location.href='/runtest';
    }
  }
}

angular.module('sscTestSeriesApp')
  .component('viewpack', {
    templateUrl: 'app/viewpack/viewpack.html',
    controller: ViewpackComponent,
    controllerAs: 'viewpackCtrl'
  });

})();
