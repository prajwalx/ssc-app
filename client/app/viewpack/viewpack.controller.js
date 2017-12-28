'use strict';

(function(){

class ViewpackComponent {
  constructor($http) {
    this.message = 'Hello';
    this.$http=$http;
    this.opid=sessionStorage.getItem('opid');

    this.pack;
    this.tests=[];
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
    }
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
}

angular.module('sscTestSeriesApp')
  .component('viewpack', {
    templateUrl: 'app/viewpack/viewpack.html',
    controller: ViewpackComponent,
    controllerAs: 'viewpackCtrl'
  });

})();
