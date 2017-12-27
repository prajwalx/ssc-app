'use strict';

(function(){

class MypackagesComponent {
  constructor($http,$scope,Auth) {
    this.message = 'Hello';
    this.$http=$http;
    this.$scope=$scope;
    this.Auth=Auth;

    this.purchasedIds=(this.Auth.getCurrentUser().packIDs);
    if(this.purchasedIds)
    this.purchasedIds=JSON.parse(this.purchasedIds);

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
    return true;
    for(var i in this.purchasedIds){
      if(id===this.purchasedIds[i])
      return false;
    }
    return true;

  }
}

angular.module('sscTestSeriesApp')
  .component('mypackages', {
    templateUrl: 'app/mypackages/mypackages.html',
    controller: MypackagesComponent,
    controllerAs: 'mypackagesCtrl'
  });

})();
