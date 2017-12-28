'use strict';

(function(){

class MypackagesComponent {
  constructor($http,$scope,Auth) {
    this.message = 'Hello';
    this.$http=$http;
    this.$scope=$scope;
    this.Auth=Auth;

    this.packs=[];
  }
  $onInit(){
    this.$http.get('/api/packs')
      .then(response=>{
        this.packs=response.data;

        for(var i in this.packs){
          this.GetAndSetSpecs(i);
        }
      });

      // @kingcody sorry, my fault in explaining.
      // I was particularly focused on the isAdmin method and
      //I see that it returns a Bool if no argument is present.
      // Correct me if I am wrong, but this means I have to pass
      //a non-function callback as argument to use the promise, right?
      this.Auth.getCurrentUser(function(usr){
        console.log(usr);
      }).then(res=>{
        this.GetandSetPids(res.packIDs);
      });

  }

  GetandSetPids(packIDs){
    //this.user=this.Auth.getCurrentUser();
    console.log(packIDs);
    this.purchasedIds=packIDs;
    if(this.purchasedIds!==''&&this.purchasedIds)//Non-empty&&defined
    this.purchasedIds=JSON.parse(this.purchasedIds);
  }

  GetAndSetSpecs(i){
    //Assuming test of one pack are of same type only
    this.$http.get('/api/tests/'+JSON.parse(this.packs[i].TestIDs)[0])
    .then(response=>{
      this.$http.get('/api/testtypes/'+response.data.testType)
      .then(response=>{
        this.packs[i].specs=response.data;
      });
    });
  }
  isPurchased(id){
    if(!this.purchasedIds)
    return false;
    for(var i in this.purchasedIds){
      if(id===this.purchasedIds[i])
      return true;
    }
    return false;

  }

  buy(id){
    if(!this.isPurchased(id)){
    sessionStorage.setItem('pid',id);
    location.href='/payment';
    }
  else{
    this.open(id);
    }
  }

  open(id){
    sessionStorage.setItem('opid',id);
    location.href='/viewpack';
  }
}


angular.module('sscTestSeriesApp')
  .component('mypackages', {
    templateUrl: 'app/mypackages/mypackages.html',
    controller: MypackagesComponent,
    controllerAs: 'mypackagesCtrl'
  });

})();
